package com.example.clinic_appointment_schedulerm.service;

import com.example.clinic_appointment_schedulerm.entity.AiChat;
import com.example.clinic_appointment_schedulerm.repository.AiChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatService {
    
    private final AiChatRepository aiChatRepository;
    private final GeminiService geminiService;
    
    @Transactional
    public String processSymptoms(String symptoms, String userEmail) {
        String aiResponse = geminiService.generateMedicalResponse(symptoms);
        
        AiChat chat = AiChat.builder()
                .userEmail(userEmail)
                .userMessage(symptoms)
                .aiResponse(aiResponse)
                .build();
        
        aiChatRepository.save(chat);
        return aiResponse;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getChatHistory(String userEmail) {
        return aiChatRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(chat -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", chat.getId());
                    map.put("userMessage", chat.getUserMessage());
                    map.put("aiResponse", chat.getAiResponse());
                    map.put("createdAt", chat.getCreatedAt().toString());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearChatHistory(String userEmail) {
        aiChatRepository.deleteByUserEmail(userEmail);
    }



}