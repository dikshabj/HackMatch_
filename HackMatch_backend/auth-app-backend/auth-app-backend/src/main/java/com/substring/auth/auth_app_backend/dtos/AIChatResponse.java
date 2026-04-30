package com.substring.auth.auth_app_backend.dtos;

import lombok.Data;
import java.util.List;

@Data
public class AIChatResponse {
    private List<Choice> choices;

    @Data
    public static class Choice {
        private Message message;
    }

    @Data
    public static class Message {
        private String content;
    }
}

