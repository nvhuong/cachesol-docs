package com.cachesol.platform.iam.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * IAM service chỉ phơi ra 3 nhóm endpoint:
 *
 *  - /public-api/v1/health/**     — health probes (no auth, K8s scrape)
 *  - /integration-api/v1/webhooks/keycloak — HMAC-verified webhook (Keycloak SPI gọi vào)
 *  - /service-api/v1/**           — service-to-service (Caller: platform-registry,
 *                                    tenant-manager; network-isolated qua docker)
 *
 * Không có /client-api/** — client không bao giờ gọi IAM trực tiếp. Mọi thứ
 * đi qua gateway.
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
                        .requestMatchers("/integration-api/v1/webhooks/**").permitAll()
                        .requestMatchers("/service-api/v1/**").permitAll()
                        .anyRequest().denyAll()
                );
        return http.build();
    }
}
