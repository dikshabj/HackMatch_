package com.substring.auth.auth_app_backend.dtos;

import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class NotificationDto {
    private UUID id;
    private String title;
    private String message;
    private String type;
    private boolean isRead;
    private Instant createdAt;
    private String actionUrl;
}
