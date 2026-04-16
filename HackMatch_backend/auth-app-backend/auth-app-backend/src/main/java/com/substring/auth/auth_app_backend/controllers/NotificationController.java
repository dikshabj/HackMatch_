package com.substring.auth.auth_app_backend.controllers;

import com.substring.auth.auth_app_backend.dtos.NotificationDto;
import com.substring.auth.auth_app_backend.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Principal principal) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(principal.getName()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        return ResponseEntity.ok(notificationService.getUnreadCount(principal.getName()));
    }

    @PutMapping("/mark-as-read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.ok().build();
    }
}
