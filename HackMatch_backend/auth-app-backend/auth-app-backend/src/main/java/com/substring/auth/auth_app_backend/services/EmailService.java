package com.substring.auth.auth_app_backend.services;

public interface EmailService {
    // Simple email bhejne ke liye method
    void sendEmail(String to, String subject, String message);
}
