package com.example.clinic_appointment_schedulerm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateMedicalResponse(String symptoms) {
        try {
            log.info("Processing symptoms with Gemini AI: {}", symptoms);
            log.info("API Key configured: {}", apiKey != null && !apiKey.isEmpty() ? "Yes" : "No");

            if (apiKey == null || apiKey.isEmpty() || "your-gemini-api-key-here".equals(apiKey)) {
                log.warn("Gemini API key not configured properly");
                return getFallbackResponse(symptoms);
            }

            String prompt = createMedicalPrompt(symptoms);
            String requestBody = createRequestBody(prompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String url = apiUrl + "?key=" + apiKey;
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            log.info("Calling Gemini API: {}", url.replace(apiKey, "***"));
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            String aiResponse = extractResponseText(response.getBody());
            log.info("Gemini API response received successfully");
            return aiResponse;

        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            return getFallbackResponse(symptoms);
        }
    }

    private String createMedicalPrompt(String symptoms) {
        return "You are a friendly medical AI assistant. Analyze these symptoms and respond in a conversational, helpful tone using emojis and clear formatting. " +
               "Structure your response as: " +
               "🔍 **Quick Analysis** - Brief assessment " +
               "🎯 **Likely Causes** - 2-3 possibilities with emojis " +
               "💡 **What You Can Do** - Practical tips with emojis " +
               "⚠️ **See a Doctor If** - Warning signs " +
               "Use emojis, bullet points, and conversational language. Keep it engaging but professional. " +
               "Always include medical disclaimer. " +
               "Symptoms: " + symptoms;
    }

    private String createRequestBody(String prompt) throws Exception {
        Map<String, Object> request = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            },
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 1000
            )
        );
        String body = objectMapper.writeValueAsString(request);
        log.debug("Request body: {}", body);
        return body;
    }

    private String extractResponseText(String responseBody) throws Exception {
        log.debug("Response body: {}", responseBody);
        JsonNode root = objectMapper.readTree(responseBody);

        if (!root.has("candidates") || root.path("candidates").isEmpty()) {
            log.error("No candidates in response: {}", responseBody);
            throw new RuntimeException("Invalid API response format");
        }

        String text = root.path("candidates")
                  .get(0)
                  .path("content")
                  .path("parts")
                  .get(0)
                  .path("text")
                  .asText();

        if (text.isEmpty()) {
            log.error("Empty text in response: {}", responseBody);
            throw new RuntimeException("Empty response from API");
        }

        return text;
    }

    private String getFallbackResponse(String symptoms) {
        return "🔍 **Quick Assessment**\n\n" +
               "I'm having trouble connecting to my AI brain right now, but I can still help! 🤖\n\n" +
               "🎯 **For your symptoms: \"" + symptoms + "\"**\n\n" +
               "💡 **What you can do right now:**\n" +
               "• 💧 Stay well hydrated\n" +
               "• 😴 Get plenty of rest\n" +
               "• 🌡️ Monitor your temperature\n" +
               "• 📝 Keep track of symptom changes\n\n" +
               "⚠️ **Important:** This is just general advice! Please consult our qualified doctors " +
               "for proper medical evaluation and personalized treatment.\n\n" +
               "📞 **Ready to book?** Schedule an appointment through our system for professional care!";
    }
}