package com.substring.auth.auth_app_backend.dtos;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AIChatRequest {
    private String model = "llama-3.3-70b-versatile"; // Latest fast model
    private List<Message> messages;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
