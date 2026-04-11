package com.substring.auth.auth_app_backend.dtos;

import lombok.Builder;

@Builder
public record TokenResponse(
        String accessToken,
        String refreshToken,
        long expiresIn,
        String tokenType,
        UserDto userDto
) {
    public static TokenResponse bearer(String accessToken, String refreshToken, long expiresIn ,  UserDto user)
    {
        return new TokenResponse(accessToken, refreshToken, expiresIn ,  "Bearer" , user);

    }



}
