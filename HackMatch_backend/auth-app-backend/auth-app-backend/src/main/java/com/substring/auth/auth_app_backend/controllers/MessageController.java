package com.substring.auth.auth_app_backend.controllers;

import com.substring.auth.auth_app_backend.dtos.MessageDto;
import com.substring.auth.auth_app_backend.entities.Message;
import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.repositories.MessageRepository;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

}
