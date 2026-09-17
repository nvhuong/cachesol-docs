package com.cachesol.platform.tenant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "com.cachesol.platform.tenant",
        "com.cachesol.platform.shared.security",
        "com.cachesol.platform.shared.messaging",
        "com.cachesol.platform.shared.common"
})
public class TenantManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TenantManagerApplication.class, args);
    }
}
