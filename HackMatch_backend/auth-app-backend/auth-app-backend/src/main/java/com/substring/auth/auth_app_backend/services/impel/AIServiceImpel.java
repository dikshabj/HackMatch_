package com.substring.auth.auth_app_backend.services.impel;

import com.substring.auth.auth_app_backend.dtos.*;
import com.substring.auth.auth_app_backend.services.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIServiceImpel implements AIService {

    private final WebClient webClient;

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url}")
    private String apiUrl;

    @Override
    public String getAIResponse(String prompt) {
        AIChatRequest request = AIChatRequest.builder()
                .messages(List.of(new AIChatRequest.Message("user", prompt)))
                .build();

        AIChatResponse response = webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AIChatResponse.class)
                .block();

        return response.getChoices().get(0).getMessage().getContent();
    }

    @Override
    public List<UserDto> rankTeammatesWithAI(UserDto currentUser, List<UserDto> candidates) {
        if (candidates.isEmpty()) return List.of();

        String prompt = String.format(
            "I am a developer with skills: %s. Here is a list of potential teammates: %s. " +
            "Please return ONLY the comma-separated emails of the top 3 most compatible partners. " +
            "Focus on complementary skills (e.g. if I'm Frontend, look for Backend).",
            currentUser.getSkills(),
            candidates.stream().map(c -> c.getEmail() + ":" + c.getSkills()).collect(Collectors.joining(", "))
        );

        try {
            String aiResult = getAIResponse(prompt);
            return candidates.stream()
                    .filter(c -> aiResult.contains(c.getEmail()))
                    .limit(5)
                    .toList();
        } catch (Exception e) {
            // Agar AI fail ho jaye, to default top results dikha do (taaki app crash na ho)
            return candidates.stream().limit(5).toList();
        }
    }
}
