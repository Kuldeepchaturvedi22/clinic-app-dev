package com.example.clinic_appointment_schedulerm.repository;

import com.example.clinic_appointment_schedulerm.entity.AiChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiChatRepository extends JpaRepository<AiChat, Long> {
    List<AiChat> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    void deleteByUserEmail(String userEmail);
}