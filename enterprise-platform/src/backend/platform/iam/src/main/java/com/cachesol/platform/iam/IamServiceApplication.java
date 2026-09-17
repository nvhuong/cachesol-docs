package com.cachesol.platform.iam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "com.cachesol.platform.iam",
        "com.cachesol.platform.shared.common",
        "com.cachesol.platform.shared.security",
        "com.cachesol.platform.shared.messaging"
})
public class IamServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(IamServiceApplication.class, args);
    }
}
