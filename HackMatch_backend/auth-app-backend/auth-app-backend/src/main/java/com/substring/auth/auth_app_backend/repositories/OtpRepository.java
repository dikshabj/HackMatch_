package com.substring.auth.auth_app_backend.repositories;

import com.substring.auth.auth_app_backend.entities.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRepository extends JpaRepository<Otp, UUID> {
    
    // Email se OTP dhoondne ke liye
    Optional<Otp> findByEmail(String email);
    
    // Purane OTPs delete karne ke liye
    void deleteByEmail(String email);
}
