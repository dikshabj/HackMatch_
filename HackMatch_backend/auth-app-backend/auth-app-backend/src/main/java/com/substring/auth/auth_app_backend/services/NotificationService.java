package com.substring.auth.auth_app_backend.services;

import com.substring.auth.auth_app_backend.dtos.NotificationDto;
import com.substring.auth.auth_app_backend.entities.User;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void createNotification(User recipient, String title, String message, String type, String actionUrl);
    List<NotificationDto> getNotificationsForUser(String email);
    void markAsRead(UUID notificationId);
    void markAllAsRead(String email);
    long getUnreadCount(String email);
}
