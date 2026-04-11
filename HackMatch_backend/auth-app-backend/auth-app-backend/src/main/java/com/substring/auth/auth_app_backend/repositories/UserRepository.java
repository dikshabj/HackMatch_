package com.substring.auth.auth_app_backend.repositories;

import com.substring.auth.auth_app_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, UUID> {
    // custom find methods
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findBySkillsIn(Set<String> skills);
}
