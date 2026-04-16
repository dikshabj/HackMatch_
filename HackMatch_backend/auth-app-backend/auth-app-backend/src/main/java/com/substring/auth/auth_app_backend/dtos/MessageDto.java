package com.substring.auth.auth_app_backend.dtos;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDto {
    private UUID id;
    private UUID senderId;
    private String senderName;
    private UUID receiverId;
    private String receiverName;
    private String content;
    private Instant timestamp;
    private boolean isRead;
}
