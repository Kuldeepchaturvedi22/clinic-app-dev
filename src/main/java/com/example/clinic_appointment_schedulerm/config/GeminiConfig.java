package com.example.clinic_appointment_schedulerm.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
@Slf4j
public class GeminiConfig {
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @PostConstruct
    public void checkConfiguration() {
        if (apiKey == null || apiKey.isEmpty() || "your-gemini-api-key-here".equals(apiKey)) {
            log.warn("⚠️ Gemini API key not configured! Set GEMINI_API_KEY environment variable.");
            log.warn("Current value: {}", apiKey);
        } else {
            log.info("✅ Gemini API key configured successfully (length: {})", apiKey.length());
        }
    }
}