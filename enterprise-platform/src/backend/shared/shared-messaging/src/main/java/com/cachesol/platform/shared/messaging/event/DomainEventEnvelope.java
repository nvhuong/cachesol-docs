package com.cachesol.platform.shared.messaging.event;

import java.time.Instant;
import java.util.UUID;

/**
 * Envelope chuẩn cho mọi domain event publish qua Kafka.
 *
 * <pre>
 * {
 *   "eventId":   "uuid",
 *   "eventType": "UserCreated",
 *   "occurredAt":"2026-09-17T03:00:00Z",
 *   "tenantSlug":"acme",
 *   "correlationId":"...",
 *   "actor":     "uuid",
 *   "payload":   { ... }
 * }
 * </pre>
 */
public record DomainEventEnvelope(
        String eventId,
        String eventType,
        Instant occurredAt,
        String tenantSlug,
        String correlationId,
        String actor,
        Object payload
) {
    public static DomainEventEnvelope of(String eventType, String tenantSlug, Object payload) {
        return new DomainEventEnvelope(
                UUID.randomUUID().toString(),
                eventType,
                Instant.now(),
                tenantSlug,
                null,
                null,
                payload
        );
    }
}
