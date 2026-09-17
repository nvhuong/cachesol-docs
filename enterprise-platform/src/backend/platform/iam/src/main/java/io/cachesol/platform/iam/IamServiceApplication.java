package io.cachesol.platform.iam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * IAM Service entrypoint.
 * Port 8082 (theo services.yaml).
 */
@SpringBootApplication(scanBasePackages = {
        "io.cachesol.platform.iam",
        "io.cachesol.platform.shared.security",
        "io.cachesol.platform.shared.common"
})
public class IamServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(IamServiceApplication.class, args);
    }
}
