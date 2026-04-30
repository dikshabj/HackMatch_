package com.substring.auth.auth_app_backend.dtos;
import lombok.*;
import java.time.Instant;
import java.util.UUID;


import com.substring.auth.auth_app_backend.entities.RequestStatus;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollaborationRequestDto {
    private UUID id;
    private UserDto sender;
    private UserDto receiver;
    private RequestStatus status;
    private String message;
    private Instant createdAt;
}
