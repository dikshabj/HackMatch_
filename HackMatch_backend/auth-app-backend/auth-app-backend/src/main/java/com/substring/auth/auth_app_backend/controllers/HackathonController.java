package com.substring.auth.auth_app_backend.controllers;

import com.substring.auth.auth_app_backend.dtos.HackathonDto;
import com.substring.auth.auth_app_backend.services.HackathonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hackathons")
@RequiredArgsConstructor
public class HackathonController {

    private final HackathonService hackathonService;

    @PostMapping
    public ResponseEntity<HackathonDto> createHackathon(
            @RequestBody HackathonDto dto, Principal principal) {
        return ResponseEntity.ok(hackathonService.addHackathon(dto, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<HackathonDto>> getAllHackathons() {
        return ResponseEntity.ok(hackathonService.getAllHackathons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HackathonDto> getHackathon(@PathVariable String id) {
        return ResponseEntity.ok(hackathonService.getHackathonById(id));
    }
}
