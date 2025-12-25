package com.example.clinic_appointment_schedulerm.controller;

import com.example.clinic_appointment_schedulerm.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-chat")
@RequiredArgsConstructor
public class AiChatController {
    
    private final AiChatService aiChatService;
    
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, String>> analyzeSymptoms(
            @RequestBody Map<String, String> request,
            Authentication auth) {
        String symptoms = request.get("symptoms");
        String response = aiChatService.processSymptoms(symptoms, auth.getName());
        return ResponseEntity.ok(Map.of("response", response));
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getChatHistory(Authentication auth) {
        return ResponseEntity.ok(aiChatService.getChatHistory(auth.getName()));
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testApi() {
        try {
            String response = aiChatService.processSymptoms("test headache", "test@test.com");
            return ResponseEntity.ok(Map.of("status", "success", "response", response));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("status", "error", "message", e.getMessage()));
        }
    }
    
    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> checkConfig() {
        return ResponseEntity.ok(Map.of(
            "status", "API configuration check",
            "message", "Check server logs for detailed configuration info"
        ));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearChatHistory(Authentication auth) {
        aiChatService.clearChatHistory(auth.getName());
        return ResponseEntity.ok(Map.of("message", "Chat history cleared successfully"));
    }
}