package com.substring.auth.auth_app_backend.services;

import com.substring.auth.auth_app_backend.entities.User;
import org.springframework.stereotype.Service;

@Service
public class MatchService {

    public String getMatchReason(User me, User suggestion) {
        String myRole = me.getPreferredRole();
        String theirRole = suggestion.getPreferredRole();

        if (myRole != null && theirRole != null) {
            if (myRole.equals("Frontend") && theirRole.equals("Backend")) {
                return "This operator is an expert in Backend. Perfect for your Frontend skills!";
            }
            if (myRole.equals("Backend") && theirRole.equals("Frontend")) {
                return "Strong Frontend developer. They'll bring your APIs to life!";
            }
            if (myRole.equals("Backend") && theirRole.equals("UI/UX")) {
                return "Excellent UI/UX designer. They can make your robust APIs look stunning!";
            }
            if (myRole.equals("Frontend") && theirRole.equals("UI/UX")) {
                return "Great UI/UX eye. Together you'll create pixel-perfect interfaces!";
            }
            if (myRole.equals("Fullstack") && !theirRole.equals("Fullstack")) {
                return "Specialist in " + theirRole + ". Great complement to your Fullstack ability!";
            }
        }
        return "Compatible skill sets matched by Neural Link.";
    }
}
