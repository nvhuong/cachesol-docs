package com.cachesol.platform.iam.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * IAM service has only two public paths:
 * - /public-api/v1/** — health checks (no auth)
 * - /integration-api/v1/webhooks/keycloak — HMAC-verified webhook (no JWT)
 *
 * All other paths (service-api, client-api, etc.) are NOT part of IAM.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(reg -> reg
                        .requestMatchers("/public-api/v1/health/**", "/actuator/**").permitAll()
                        .requestMatchers("/integration-api/v1/webhooks/keycloak").permitAll()
                        .anyRequest().denyAll()
                );
        return http.build();
    }
}
