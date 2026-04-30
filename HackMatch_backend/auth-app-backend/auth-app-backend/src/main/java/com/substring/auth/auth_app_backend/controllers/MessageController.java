package com.substring.auth.auth_app_backend.controllers;

import com.substring.auth.auth_app_backend.dtos.MessageDto;
import com.substring.auth.auth_app_backend.entities.Message;
import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.repositories.MessageRepository;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<MessageDto>> getChatHistory(@PathVariable String userId, Principal principal) {
        String currentUserEmail = principal.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User otherUser = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("Other user not found"));

        List<Message> messages = messageRepository.findChatHistory(currentUser, otherUser);

        List<MessageDto> messageDtos = messages.stream()
                .map(msg -> MessageDto.builder()
                        .id(msg.getId())
                        .senderId(msg.getSender().getId())
                        .senderName(msg.getSender().getName())
                        .receiverId(msg.getReceiver().getId())
                        .receiverName(msg.getReceiver().getName())
                        .content(msg.getContent())
                        .timestamp(msg.getTimestamp())
                        .isRead(msg.isRead())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(messageDtos);
    }
}
