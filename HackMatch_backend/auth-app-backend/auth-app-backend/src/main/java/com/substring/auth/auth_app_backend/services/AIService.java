package com.substring.auth.auth_app_backend.services;

import com.substring.auth.auth_app_backend.dtos.UserDto;
import java.util.List;

public interface AIService {
    String getAIResponse(String prompt);
    List<UserDto> rankTeammatesWithAI(UserDto currentUser, List<UserDto> candidates);
}
