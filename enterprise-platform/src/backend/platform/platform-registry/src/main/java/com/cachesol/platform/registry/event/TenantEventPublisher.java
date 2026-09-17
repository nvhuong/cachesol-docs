package com.cachesol.platform.registry.event;

import com.cachesol.platform.shared.messaging.event.DomainEventEnvelope;
import com.cachesol.platform.shared.messaging.publisher.EventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Publish các domain event của platform-registry ra Kafka.
 */
@Component
@RequiredArgsConstructor
public class TenantEventPublisher {

    private final EventPublisher publisher;

    public void publishCreated(String slug, String name) {
        publisher.publish("tenant.created", DomainEventEnvelope.of(
                "TenantCreated", slug,
                Map.of("slug", slug, "name", name)
        ));
    }

    public void publishActivated(String slug) {
        publisher.publish("tenant.activated", DomainEventEnvelope.of(
                "TenantActivated", slug, Map.of("slug", slug)
        ));
    }

    public void publishMiniAppRegistered(String tenantSlug, String code, String version) {
        publisher.publish("miniapp.registered", DomainEventEnvelope.of(
                "MiniAppRegistered", tenantSlug,
                Map.of("code", code, "version", version != null ? version : "0.0.1")
        ));
    }
}
