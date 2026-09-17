package com.cachesol.platform.tenant.event;

import com.cachesol.platform.shared.messaging.event.DomainEventEnvelope;
import com.cachesol.platform.shared.messaging.publisher.EventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class TenantEventPublisher {

    private final EventPublisher publisher;

    public void publishUserCreated(String tenantSlug, String username) {
        publisher.publish("user.created", DomainEventEnvelope.of(
                "UserCreated", tenantSlug,
                Map.of("username", username)
        ));
    }

    public void publishRoleAssigned(String tenantSlug, String username, String roleCode) {
        publisher.publish("user.role.assigned", DomainEventEnvelope.of(
                "UserRoleGranted", tenantSlug,
                Map.of("username", username, "roleCode", roleCode)
        ));
    }

    public void publishOrgCreated(String tenantSlug, String code) {
        publisher.publish("org.created", DomainEventEnvelope.of(
                "OrganizationCreated", tenantSlug,
                Map.of("code", code)
        ));
    }

    public void publishEmployeeAssigned(String tenantSlug, String employeeCode, String orgCode) {
        publisher.publish("employee.assigned", DomainEventEnvelope.of(
                "EmployeeAssigned", tenantSlug,
                Map.of("employeeCode", employeeCode, "orgCode", orgCode)
        ));
    }
}
