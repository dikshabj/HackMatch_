package com.substring.auth.auth_app_backend.services;

public interface ForgotPasswordService {
    // 1. OTP bhejne ke liye
    void sendOtp(String email);

    // 2. OTP verify karne ke liye
    boolean verifyOtp(String email, String otp);

    // 3. Password reset karne ke liye
    void resetPassword(String email, String otp, String newPassword);
}
