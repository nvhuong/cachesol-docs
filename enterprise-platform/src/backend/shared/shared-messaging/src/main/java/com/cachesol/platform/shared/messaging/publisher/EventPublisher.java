package com.cachesol.platform.shared.messaging.publisher;

import com.cachesol.platform.shared.messaging.event.DomainEventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Wrapper cho Kafka producer — ghi log + set {@code eventId} làm key (đảm bảo ordering per event).
 * Mọi service publish event qua class này để chuẩn hoá.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EventPublisher {

    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(String topic, DomainEventEnvelope event) {
        if (kafkaTemplate == null) {
            log.warn("KafkaTemplate not configured — skipping publish topic={} event={}", topic, event.eventType());
            return;
        }
        kafkaTemplate.send(topic, event.eventId(), event)
                .whenComplete((res, ex) -> {
                    if (ex != null) log.error("Publish failed topic={} event={}", topic, event.eventType(), ex);
                    else log.debug("Published topic={} partition={} offset={}",
                            topic, res.getRecordMetadata().partition(), res.getRecordMetadata().offset());
                });
    }
}
