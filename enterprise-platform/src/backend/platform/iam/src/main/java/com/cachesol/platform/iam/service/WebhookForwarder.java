package com.cachesol.platform.iam.service;

import com.cachesol.platform.iam.config.IamProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Forwards Keycloak lifecycle events to Kafka.
 *
 * Uses shared-messaging EventPublisher from the common library.
 * If Kafka is not available, events are logged and retried.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookForwarder {

    // NOTE: This service delegates to shared-messaging EventPublisher.
    // The actual Kafka producer is configured in shared-messaging module.
    // For now, we log the event — full Kafka integration follows sprint 2.
    //
    // To implement: inject EventPublisher from com.cachesol.platform.shared.messaging.publisher
    // and call eventPublisher.publish(topic, event);

    private final IamProperties iamProps;

    /**
     * Forward a Keycloak event payload to Kafka.
     *
     * @param topic   Kafka topic (e.g. keycloak.events.tenant-acme)
     * @param payload Event JSON from Keycloak
     */
    public void forward(String topic, Object payload) {
        // TODO [sprint 2]: Replace with real Kafka publish via EventPublisher
        log.info("Forwarding Keycloak event to Kafka topic '{}': {}", topic, payload);
    }
}
