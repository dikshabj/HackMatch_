package com.substring.auth.auth_app_backend.configurations;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.substring.auth.auth_app_backend.entities.Message;
import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.repositories.MessageRepository;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class SocketHandler {
    private final SocketIOServer server;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public SocketHandler(SocketIOServer server, MessageRepository messageRepository,
                         UserRepository userRepository) {
        this.server = server;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;

        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        server.addEventListener("send_message", Map.class, onMessageReceived());
    }

    private ConnectListener onConnected() {
        return client -> {
            String userId = client.getHandshakeData().getSingleUrlParam("userId");
            if (userId != null) {
                client.joinRoom(userId);
                System.out.println("✅ User connected to socket: " + userId);
            }
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            System.out.println("❌ User disconnected from socket: " + client.getSessionId());
        };
    }

    private DataListener<Map> onMessageReceived() {
        return (client, data, ackSender) -> {
            try {
                String senderId = (String) data.get("senderId");
                String receiverId = (String) data.get("receiverId");
                String content = (String) data.get("content");

                System.out.println("📩 Message Event: " + senderId + " -> " + receiverId);

                // Save to Database
                User sender = userRepository.findById(UUID.fromString(senderId)).orElse(null);
                User receiver = userRepository.findById(UUID.fromString(receiverId)).orElse(null);

                if (sender != null && receiver != null) {
                    Message message = Message.builder()
                            .sender(sender)
                            .receiver(receiver)
                            .content(content)
                            .build();
                    messageRepository.save(message);

                    // Broadcast to receiver's private room
                    server.getRoomOperations(receiverId).sendEvent("receive_message", Map.of(
                            "id", message.getId().toString(),
                            "senderId", senderId,
                            "senderName", sender.getName(),
                            "receiverId", receiverId,
                            "content", content,
                            "timestamp", message.getTimestamp().toString()
                    ));
                    
                    System.out.println("✅ Message saved & routed successfully.");
                } else {
                    System.err.println("❌ Critical: Identity not found in database for message routing.");
                }
            } catch (Exception e) {
                System.err.println("🔥 Socket Error: " + e.getMessage());
            }
        };
    }

    // Generic method to send notifications from other services
    public void sendNotification(String userId, Map<String, Object> data) {
        server.getRoomOperations(userId).sendEvent("notification", data);
    }
}