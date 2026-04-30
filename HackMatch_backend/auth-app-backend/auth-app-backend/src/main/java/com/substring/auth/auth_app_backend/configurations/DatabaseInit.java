package com.substring.auth.auth_app_backend.configurations;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInit {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInit.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        try {
            logger.info("Running custom database initialization...");
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS users_skills (" +
                    "user_id binary(16) NOT NULL, " +
                    "skill varchar(255))");
            logger.info("Successfully ensured users_skills table exists.");
        } catch (Exception e) {
            logger.error("Failed to create users_skills table: ", e);
        }
    }
}
