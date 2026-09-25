package com.cachesol.platform.registry.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security config cho platform-registry.
 *
 * <p>Path conventions (xem {@code governance/architecture/api-patterns.md}):
 * <ul>
 *   <li>{@code /public-api/**} — public, unauthenticated (catalog, registration, health)</li>
 *   <li>{@code /client-api/**} — authenticated user API (chưa wired MVP)</li>
 *   <li>{@code /service-api/**} — internal S2S (tenant-manager callback)</li>
 * </ul>
 *
 * <p>MVP: giữ allow-everyone cho cả internal/client API. Khi tích hợp JWT
 * thật, chỉ cần thay rule cho {@code /client-api} + {@code /service-api}.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(c -> c.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(reg -> reg.anyRequest().permitAll());
        return http.build();
    }
}
