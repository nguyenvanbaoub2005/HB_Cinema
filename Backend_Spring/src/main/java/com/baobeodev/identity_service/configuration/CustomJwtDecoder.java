package com.baobeodev.identity_service.configuration;

import com.baobeodev.identity_service.dto.request.IntrospectRequest;
import com.baobeodev.identity_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import java.text.ParseException;
import java.util.Objects;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

@Component
public class CustomJwtDecoder implements JwtDecoder {
  @Value("${jwt.signerKey}")
  private String signerKey;

  @Autowired private AuthenticationService authenticationService;

  private NimbusJwtDecoder nimbusJwtDecoder = null;

  @Override
  public Jwt decode(String token) throws JwtException {

    try {
      // nếu introspect false thì trả về exepsion
      var response =
          authenticationService.introspect(IntrospectRequest.builder().token(token).build());

      if (!response.isValid()) throw new BadJwtException("Token invalid");
    } catch (JOSEException | ParseException e) {
      throw new JwtException(e.getMessage());
    }
    // mã hoá token
    if (Objects.isNull(nimbusJwtDecoder)) {
      SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
      nimbusJwtDecoder =
          NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
    }

    return nimbusJwtDecoder.decode(token);
  }
}
