package com.substring.auth.auth_app_backend.configurations;

import com.substring.auth.auth_app_backend.entities.Role;
import com.substring.auth.auth_app_backend.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class RoleSeeder {

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(Role.STUDENT).isEmpty()) {
                Role studentRole = new Role();
                studentRole.setName(Role.STUDENT);
                roleRepository.save(studentRole);
                System.out.println("Seeded default role: " + Role.STUDENT);
            }
        };
    }
}
