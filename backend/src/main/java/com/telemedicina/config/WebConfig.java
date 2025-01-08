package com.telemedicina.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for specific origins (e.g., your frontend running on localhost:3000)
        registry.addMapping("/**") // Enable CORS for all endpoints
                .allowedOrigins("http://localhost:63342") // Replace with the origin of your frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow the necessary HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow sending cookies if needed
    }
}
