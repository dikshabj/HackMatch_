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
            seedRole(roleRepository, Role.STUDENT);
            seedRole(roleRepository, Role.ORGANIZER);
            seedRole(roleRepository, Role.SPONSOR);
        };
    }

    private void seedRole(RoleRepository repo, String roleName) {
        if (repo.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            repo.save(role);
            System.out.println("Seeded role: " + roleName);
        }
    }
}
