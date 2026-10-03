package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.AuthenticationRequest;
import com.baobeodev.identity_service.dto.request.IntrospectRequest;
import com.baobeodev.identity_service.dto.request.LogoutRequest;
import com.baobeodev.identity_service.dto.request.RefreshRequest;
import com.baobeodev.identity_service.dto.response.AuthenticationResponse;
import com.baobeodev.identity_service.dto.response.IntrospectResponse;
import com.baobeodev.identity_service.entity.InvalidatedToken;
import com.baobeodev.identity_service.entity.User;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.repository.InvalidatedTokenRepository;
import com.baobeodev.identity_service.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
  UserRepository userRepository;
  InvalidatedTokenRepository invalidatedTokenRepository;

  @NonFinal
  @Value("${jwt.signerKey}")
  protected String SIGNER_KEY;

  @NonFinal
  @Value("${jwt.valid-duration}")
  protected long VALID_DURATION;

  @NonFinal
  @Value("${jwt.refreshable-duration}")
  protected long REFRESHABLE_DURATION;

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    var user =
        userRepository
            .findByUsername(request.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    //// so sánh mk mà người dùng đã nhập với mk đã mã hoá data base
    boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

    if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);
    var token = generateToken(user);
    return AuthenticationResponse.builder().token(token).authenticated(true).build();
  }

  public IntrospectResponse introspect(IntrospectRequest request)
      throws JOSEException, ParseException {
    var token = request.getToken();
    boolean isValid = true;
    try {
      verifyToken(token, false);
    } catch (AppException e) {
      return IntrospectResponse.builder().valid(false).build();
    }
    return IntrospectResponse.builder().valid(true).build();
  }

  public AuthenticationResponse refreshToken(RefreshRequest request)
      throws ParseException, JOSEException {
    //  gọi verifyToken để xác thực thông tin
    var signedJWT = verifyToken(request.getToken(), true);
    var jit = signedJWT.getJWTClaimsSet().getJWTID(); // lấy Id token
    var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime(); // lấy thời gian hết hạn
    // Lưu token cũ vào bảng InvalidatedToken để đánh dấu bị hết hạn (logout)
    InvalidatedToken invalidatedToken =
        InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
    invalidatedTokenRepository.save(invalidatedToken);
    // lấy thông tin người dung để tạo token mới
    var username =
        signedJWT.getJWTClaimsSet().getSubject(); // Lấy thông tin người dùng từ token cũ.
    var user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    var token = generateToken(user);
    // cấp token mới và set lại là true cho nó
    return AuthenticationResponse.builder().token(token).authenticated(true).build();
  }

  public void logout(LogoutRequest request) throws ParseException, JOSEException {
    try {
      var signToken = verifyToken(request.getToken(), true);

      String jit = signToken.getJWTClaimsSet().getJWTID();
      Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

      InvalidatedToken invalidatedToken =
          InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

      invalidatedTokenRepository.save(invalidatedToken);
    } catch (AppException exception) {
      log.info("Token already expired");
    }
  }

  private SignedJWT verifyToken(String token, boolean isRefresh)
      throws ParseException, JOSEException {
    JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
    SignedJWT signedJWT = SignedJWT.parse(token);
    // nếu là refresh thì sẽ lấy thời gian xác thực đó + REFRESHABLE_DURATION(biến rì phét)
    Date expiryTime =
        (isRefresh)
            ? new Date(
                signedJWT
                    .getJWTClaimsSet()
                    .getIssueTime()
                    .toInstant()
                    .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                    .toEpochMilli())
            : signedJWT.getJWTClaimsSet().getExpirationTime();
    var verified = signedJWT.verify(verifier);
    // nếu token bị thay đổi hoặc hết hạn thì
    if (!(verified && expiryTime.after(new Date())))
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    // nếu đã tồn tại token trong lớp logouttoken thì đã đăng xuất rồi
    // nên bắt lỗi
    if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
      throw new AppException((ErrorCode.UNAUTHENTICATED));
    }
    return signedJWT;
  }

  private String generateToken(User user) {
    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
    JWTClaimsSet jwtClaimsSet =
        new JWTClaimsSet.Builder()
            .subject(user.getUsername())
            .issuer("baobeo.com")
            .issueTime(new Date())
            .expirationTime(
                new Date(
                    Instant.now()
                        .plus(VALID_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli())) // token hết hạng sau 1 h
            .jwtID(UUID.randomUUID().toString()) // tạo claim id jwt
            .claim("email", user.getEmail()) // Thêm email của người dùng vào token
            .claim("scope", BuildScope(user)) // list role này spring sẽ tự xử lý
            .build();

    Payload payload = new Payload(jwtClaimsSet.toJSONObject());
    // truyền header và payload(noidung)
    JWSObject jwsObject = new JWSObject(header, payload);

    try { // kí , hash cái content này
      jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
      return jwsObject.serialize();
    } catch (JOSEException e) {
      log.error("Cannot create token", e);
      throw new RuntimeException(e);
    }
  }

  // Kết hợp tất cả vào một chuỗi dạng: "ROLE_<role> <permission1> <permission2>".
  private String BuildScope(User user) {
    StringJoiner stringJoiner = new StringJoiner(" ");
    if (!CollectionUtils.isEmpty(user.getRoles())) {
      user.getRoles()
          .forEach(
              role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                  role.getPermissions()
                      .forEach(permission -> stringJoiner.add(permission.getName()));
                }
              });
    }
    return stringJoiner.toString();
  }
}
