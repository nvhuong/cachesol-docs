package com.cachesol.platform.registry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {
        "com.cachesol.platform.registry",
        "com.cachesol.platform.shared.security",
        "com.cachesol.platform.shared.messaging",
        "com.cachesol.platform.shared.common"
})
@EnableScheduling
public class PlatformRegistryApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlatformRegistryApplication.class, args);
    }
}
