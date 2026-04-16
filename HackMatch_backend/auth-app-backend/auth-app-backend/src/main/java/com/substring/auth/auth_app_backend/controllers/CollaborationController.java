package com.substring.auth.auth_app_backend.controllers;

import com.substring.auth.auth_app_backend.dtos.CollaborationRequestDto;
import com.substring.auth.auth_app_backend.services.CollaborationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class CollaborationController {
    private final CollaborationService collaborationService;

    @PostMapping("/send/{receiverId}")
    public ResponseEntity<CollaborationRequestDto> sendRequest(
            Principal principal,
            @PathVariable String receiverId,
            @RequestBody Map<String, String> requestBody // Recommended: JSON se message nikalne ke liye
    ) {
        String message = requestBody.get("message");
        return ResponseEntity.ok(collaborationService.sendRequest(principal.getName(), receiverId, message));
    }

    @GetMapping("/received")
    public ResponseEntity<List<CollaborationRequestDto>> getReceivedRequests(Principal principal) {
        return ResponseEntity.ok(collaborationService.getReceivedRequests(principal.getName()));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<CollaborationRequestDto>> getSentRequests(Principal principal) {
        return ResponseEntity.ok(collaborationService.getSentRequests(principal.getName()));
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<CollaborationRequestDto>> getAcceptedConnections(Principal principal) {
        return ResponseEntity.ok(collaborationService.getAcceptedConnections(principal.getName()));
    }

    @PutMapping("/{requestId}/{status}")
    public ResponseEntity<CollaborationRequestDto> updateStatus(
            @PathVariable String requestId,
            @PathVariable String status) {
        return ResponseEntity.ok(collaborationService.updateRequestStatus(requestId, status));
    }

}
