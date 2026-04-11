package com.substring.auth.auth_app_backend.services.impel;

import com.substring.auth.auth_app_backend.dtos.CollaborationRequestDto;
import com.substring.auth.auth_app_backend.entities.CollaborationRequest;
import com.substring.auth.auth_app_backend.entities.RequestStatus;
import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.helpers.UserHelper;
import com.substring.auth.auth_app_backend.repositories.CollaborationRepository;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import com.substring.auth.auth_app_backend.services.CollaborationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class CollaborationServiceImpel implements CollaborationService {
    private final CollaborationRepository collaborationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public CollaborationRequestDto sendRequest(String senderEmail, String receiverId , String message){
        User sender = userRepository.findByEmail(senderEmail).orElseThrow();

        User receiver = userRepository.findById(UserHelper.parseUUID(receiverId)).orElseThrow();

        CollaborationRequest request = CollaborationRequest.builder()
        .sender(sender)
        .receiver(receiver)
        .message(message)
        .status(RequestStatus.PENDING)
        .build();

        return modelMapper.map(collaborationRepository.save(request), CollaborationRequestDto.class);

    }

    @Override
    public List<CollaborationRequestDto> getReceivedRequests(String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return collaborationRepository.findByReceiver(user).stream()
        .map(req -> modelMapper.map(req, CollaborationRequestDto.class))
        .toList();

    }

    @Override
public CollaborationRequestDto updateRequestStatus(String requestId, String status) {
    CollaborationRequest request = collaborationRepository.findById(UUID.fromString(requestId))
            .orElseThrow(() -> new RuntimeException("Request not found"));

    try {
        request.setStatus(RequestStatus.valueOf(status.toUpperCase()));
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Invalid Status: " + status);
    }

    return modelMapper.map(collaborationRepository.save(request), CollaborationRequestDto.class);
}
    
}
