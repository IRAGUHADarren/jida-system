package com.auca.jida;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class JidaSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(JidaSystemApplication.class, args);
    }
}

