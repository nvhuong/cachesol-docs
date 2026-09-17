package io.cachesol.platform.registry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "io.cachesol.platform.registry",
        "io.cachesol.platform.shared.security",
        "io.cachesol.platform.shared.messaging",
        "io.cachesol.platform.shared.common"
})
public class PlatformRegistryApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlatformRegistryApplication.class, args);
    }
}
