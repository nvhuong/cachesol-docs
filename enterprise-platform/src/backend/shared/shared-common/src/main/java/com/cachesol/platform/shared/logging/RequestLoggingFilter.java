package com.cachesol.platform.shared.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * RequestLoggingFilter — Ghi access log cho mọi HTTP request.
 */
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger("ACCESS");
    private static final Logger perfLog = LoggerFactory.getLogger("PERFORMANCE");

    private static final long SLOW_API_MS = 1000L;

    private static final String[] SKIP_PREFIXES = {
            "/actuator", "/health", "/favicon.ico", "/static", "/swagger"
    };

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        for (String prefix : SKIP_PREFIXES) {
            if (path.startsWith(prefix)) return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        long startNanos = System.nanoTime();
        Throwable thrown = null;
        try {
            chain.doFilter(request, response);
        } catch (Throwable t) {
            thrown = t;
            throw t;
        } finally {
            long durationMs = (System.nanoTime() - startNanos) / 1_000_000L;
            int status = response.getStatus();
            String method = request.getMethod();
            String path = request.getRequestURI();

            String msg = "HTTP " + method + " " + path + " status=" + status + " latency_ms=" + durationMs;

            if (thrown != null) {
                log.error(msg + " ex=" + thrown.getClass().getSimpleName(), thrown);
            } else if (status >= 500) {
                log.error(msg);
            } else if (status >= 400) {
                log.warn(msg);
            } else {
                log.info(msg);
            }

            if (durationMs > SLOW_API_MS) {
                perfLog.warn("Slow API: {} {} took {}ms", method, path, durationMs);
            }
        }
    }
}
