package com.substring.auth.auth_app_backend.repositories;

import com.substring.auth.auth_app_backend.entities.Hackathon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HackathonRepository extends JpaRepository<Hackathon, UUID> {
    
}
