package com.substring.auth.auth_app_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User recipient;

    private String title;
    private String message;
    private String type; // CONNECTION_REQUEST, CONNECTION_ACCEPTED, etc.
    
    private boolean isRead = false;

    @Builder.Default
    private Instant createdAt = Instant.now();
    
    private String actionUrl; // Optional: where to go when clicked
}
