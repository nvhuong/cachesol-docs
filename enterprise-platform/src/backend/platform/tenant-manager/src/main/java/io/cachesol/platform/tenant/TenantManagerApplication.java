package io.cachesol.platform.tenant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "io.cachesol.platform.tenant",
        "io.cachesol.platform.shared.security",
        "io.cachesol.platform.shared.messaging",
        "io.cachesol.platform.shared.common"
})
public class TenantManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TenantManagerApplication.class, args);
    }
}
