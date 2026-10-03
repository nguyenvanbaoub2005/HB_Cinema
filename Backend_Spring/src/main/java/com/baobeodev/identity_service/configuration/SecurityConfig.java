package com.baobeodev.identity_service.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@Slf4j
@EnableWebSecurity
@EnableMethodSecurity // @PreAuthorize: Kiểm tra quyền hạn trước khi gọi phương thức.
// @PostAuthorize: Kiểm tra quyền hạn sau khi phương thức được gọi.

public class SecurityConfig {
  @Autowired CustomJwtDecoder customJwtDecoder;
  private final String[] PUBLIC_ENDPOINTS_METHOD_POST = {
    "/users", "/auth/token", "/auth/introspect", "/auth/logout", "/auth/refresh"
  };
  // PUBLIC_ENDPOINTS cái nào cần admin thì đã preauthorize rồi
  private final String[] PUBLIC_ENDPOINTS = {
    "/schedule/movies/{movieId}",
    "/movies",
    "/movies/{movieId}",
    "/rooms/branch/{branchId}",
    "/branch",
    "/seats",
    "seats/{seatID}",
    "seats/schedule/{scheduleId}"
  };

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity.authorizeHttpRequests(
        request ->
            request
                .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_METHOD_POST)
                .permitAll()
                .requestMatchers(PUBLIC_ENDPOINTS)
                .permitAll()
                .anyRequest()
                .authenticated());
    httpSecurity.oauth2ResourceServer(
        oauth2 ->
            oauth2
                .jwt(
                    jwtConfigurer ->
                        jwtConfigurer
                            .decoder(customJwtDecoder)
                            .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));
    httpSecurity.csrf(AbstractHttpConfigurer::disable);
    return httpSecurity.build();
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
  }
  ;

  @Bean
  JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
        new JwtGrantedAuthoritiesConverter();
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }

  @Configuration
  public class WebConfig {
    @Bean
    public CorsFilter corsFilter() {
      // Tạo cấu hình CORS
      CorsConfiguration corsConfiguration = new CorsConfiguration();
      corsConfiguration.addAllowedOrigin("http://localhost:3000"); // Cho phép tất cả các origin
      corsConfiguration.addAllowedMethod("*"); // Cho phép tất cả các phương thức
      corsConfiguration.addAllowedHeader("*"); // Cho phép tất cả các tiêu đề
      // Tạo UrlBasedCorsConfigurationSource và đăng ký cấu hình CORS
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration(
          "/**", corsConfiguration); // Áp dụng cho tất cả các đường dẫn
      // Trả về CorsFilter với nguồn cấu hình CORS
      return new CorsFilter(source);
    }
  }
}
