package com.adventuroushachi.Giffy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.adventuroushachi.Giffy.Repository")
@EntityScan("com.adventuroushachi.Giffy.Model")
public class GiffyApplication {

    public static void main(String[] args) {
        SpringApplication.run(GiffyApplication.class, args);
    }
}
