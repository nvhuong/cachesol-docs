package io.cachesol.platform.shared.security.tenant;

import io.cachesol.platform.shared.common.tenant.TenantContext;
import io.cachesol.platform.shared.security.jwt.AuthenticatedUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter: lấy tenant slug từ JWT claim → set vào {@link TenantContext}.
 * Clear ở cuối request.
 */
@Component
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof AuthenticatedUser user && user.tenantSlug() != null) {
                TenantContext.set(user.tenantSlug());
            }
            chain.doFilter(req, res);
        } finally {
            TenantContext.clear();
        }
    }
}
