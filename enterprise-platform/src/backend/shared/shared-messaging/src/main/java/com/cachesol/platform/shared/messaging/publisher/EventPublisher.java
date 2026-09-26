package com.cachesol.platform.shared.messaging.publisher;

import com.cachesol.platform.shared.messaging.event.DomainEventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Wrapper cho Kafka producer — ghi log + set {@code eventId} làm key (đảm bảo ordering per event).
 * Mọi service publish event qua class này để chuẩn hoá.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EventPublisher {

    private static final int SEND_TIMEOUT_SECONDS = 10;

    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(String topic, DomainEventEnvelope event) {
        if (kafkaTemplate == null) {
            log.warn("KafkaTemplate not configured — skipping publish topic={} event={}", topic, event.eventType());
            return;
        }
        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, event.eventId(), event);
        try {
            SendResult<String, Object> result = future.get(SEND_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            log.debug("Published topic={} partition={} offset={}",
                    topic,
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset());
        } catch (Exception e) {
            log.error("Publish failed topic={} event={}", topic, event.eventType(), e);
        }
    }
}
