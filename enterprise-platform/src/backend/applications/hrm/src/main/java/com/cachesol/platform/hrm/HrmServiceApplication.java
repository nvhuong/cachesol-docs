package com.cachesol.platform.hrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HrmServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HrmServiceApplication.class, args);
    }
}
