package com.substring.auth.auth_app_backend.services;

import com.substring.auth.auth_app_backend.dtos.CollaborationRequestDto;
import java.util.List;

public interface CollaborationService {
    CollaborationRequestDto sendRequest(String senderEmail , String receiverId , String message);
   
    List<CollaborationRequestDto> getReceivedRequests(String userEmail);
    List<CollaborationRequestDto> getSentRequests(String userEmail);
    List<CollaborationRequestDto> getAcceptedConnections(String userEmail);
    CollaborationRequestDto updateRequestStatus(String requestId , String status);
}
