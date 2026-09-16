package com.cachesol.platform.shared.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * CorrelationIdFilter — Inject trace_id, span_id, request_method, request_path vào MDC.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter extends OncePerRequestFilter {

    public static final String TRACE_HEADER = "X-Trace-Id";
    public static final String SPAN_HEADER = "X-Span-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        try {
            String traceId = headerOrNew(request, TRACE_HEADER);
            String spanId = headerOrNew(request, SPAN_HEADER);

            MDC.put("trace_id", traceId);
            MDC.put("span_id", spanId);
            MDC.put("request_method", request.getMethod());
            MDC.put("request_path", request.getRequestURI());
            MDC.put("client_ip", resolveClientIp(request));
            MDC.put("user_agent", request.getHeader("User-Agent"));

            response.setHeader(TRACE_HEADER, traceId);
            response.setHeader(SPAN_HEADER, spanId);

            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }

    private static String headerOrNew(HttpServletRequest req, String header) {
        String value = req.getHeader(header);
        return (value == null || value.isBlank()) ? UUID.randomUUID().toString() : value;
    }

    private static String resolveClientIp(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) {
            int comma = fwd.indexOf(',');
            return (comma > 0 ? fwd.substring(0, comma) : fwd).trim();
        }
        return req.getRemoteAddr();
    }
}
