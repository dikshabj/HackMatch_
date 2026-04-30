package com.substring.auth.auth_app_backend.configurations;

import com.substring.auth.auth_app_backend.entities.Role;
import com.substring.auth.auth_app_backend.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.UUID;

@Configuration
public class RoleSeeder {

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository, JdbcTemplate jdbcTemplate) {
        return args -> {
            // Fix for missing users_skills table
            try {
                jdbcTemplate.execute(
                    "CREATE TABLE IF NOT EXISTS users_skills (" +
                    "user_id binary(16) NOT NULL, " +
                    "skill varchar(255) DEFAULT NULL, " +
                    "KEY FK_users_skills_user_id (user_id), " +
                    "CONSTRAINT FK_users_skills_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE" +
                    ") ENGINE=InnoDB"
                );
                System.out.println("Ensured users_skills table exists.");
            } catch (Exception e) {
                System.err.println("Could not create users_skills table automatically: " + e.getMessage());
            }

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
