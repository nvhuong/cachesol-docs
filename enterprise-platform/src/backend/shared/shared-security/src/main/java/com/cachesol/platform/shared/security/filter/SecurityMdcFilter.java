package com.cachesol.platform.shared.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * SecurityMdcFilter — Inject user_id và tenant_id vào MDC sau khi Security authenticate xong.
 * Chạy ở LOWEST_PRECEDENCE, SAU tất cả security filter khác.
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class SecurityMdcFilter extends OncePerRequestFilter {

    private static final String ANONYMOUS = "anonymous";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                MDC.put("user_id", auth.getName());
            } else {
                MDC.put("user_id", ANONYMOUS);
            }
            chain.doFilter(request, response);
        } finally {
            MDC.remove("user_id");
            MDC.remove("tenant_id");
        }
    }
}
