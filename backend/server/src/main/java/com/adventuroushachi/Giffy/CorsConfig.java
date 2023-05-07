package com.adventuroushachi.Giffy;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
      registry.addMapping("/**")
              .allowedOrigins("https://giffy-web.adventurous-hachi.com")
              .allowedMethods("GET", "POST", "PUT", "DELETE")
              .allowedHeaders("Content-Type", "Authorization")
              .allowCredentials(true)
              .maxAge(3600);
    }
}
