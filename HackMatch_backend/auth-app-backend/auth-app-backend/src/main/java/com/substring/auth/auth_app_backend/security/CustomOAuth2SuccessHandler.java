package com.substring.auth.auth_app_backend.security;

import com.substring.auth.auth_app_backend.entities.Provider;
import com.substring.auth.auth_app_backend.entities.Role;
import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.repositories.RoleRepository;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CustomOAuth2SuccessHandler.class);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            logger.info("--- [OAUTH2 SUCCESS HANDLER START] ---");
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            String registrationId = oauthToken.getAuthorizedClientRegistrationId();
            OAuth2User oauthUser = oauthToken.getPrincipal();

            logger.info("[STEP 1] Provider: {}", registrationId);
            
            String email = oauthUser.getAttribute("email");
            String name = oauthUser.getAttribute("name");
            String image = "";
            String providerId = "";

            Provider provider = Provider.LOCAL;

            if (registrationId.equalsIgnoreCase("google")) {
                provider = Provider.GOOGLE;
                providerId = oauthUser.getAttribute("sub");
                image = oauthUser.getAttribute("picture");
            } else if (registrationId.equalsIgnoreCase("github")) {
                provider = Provider.GITHUB;
                providerId = String.valueOf(oauthUser.getAttribute("id"));
                image = oauthUser.getAttribute("avatar_url");
                if (name == null) {
                    name = oauthUser.getAttribute("login");
                }
                // GitHub fallback for email if private
                if (email == null) {
                    email = oauthUser.getAttribute("login") + "@github.com";
                    logger.warn("[STEP 2] GitHub Email is private, using fallback: {}", email);
                }
            }

            logger.info("[STEP 3] Final Email: {}", email);

            // Logic to find or create user
            final String finalEmail = email;
            // Check if user exists by email
            User user = userRepository.findByEmail(finalEmail).orElse(null);

            if (user == null) {
                logger.info("[STEP 4] User not found, creating new account for: {}", finalEmail);
                Role userRole = roleRepository.findByName("ROLE_USER")
                        .orElseGet(() -> {
                            logger.info("[STEP 4.1] ROLE_USER not found, auto-creating it");
                            Role newRole = new Role();
                            newRole.setName("ROLE_USER");
                            return roleRepository.save(newRole);
                        });

                user = User.builder()
                        .email(finalEmail)
                        .name(name)
                        .image(image)
                        .provider(provider)
                        .providerId(providerId)
                        .password(null) 
                        .roles(Set.of(userRole))
                        .enable(true)
                        .build();
                user = userRepository.save(user);
                logger.info("[STEP 4.2] Created User ID: {}", user.getId());
            } else {
                logger.info("[STEP 4] User already exists in DB: {}", user.getEmail());
                // If existing user doesn't have a provider yet (LOCAL user logging in via Social)
                if (user.getProvider() == Provider.LOCAL || user.getProviderId() == null) {
                    logger.info("[STEP 4.3] Updating existing user to {} provider", provider);
                    user.setProvider(provider);
                    user.setProviderId(providerId);
                    user.setImage(image);
                    user = userRepository.save(user);
                }
            }

            // Generate tokens
            logger.info("[STEP 5] Generating Tokens for user: {}", user.getEmail());
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            // Redirect to frontend with tokens
            String targetUrl = "http://localhost:5173/login?token=" + accessToken + "&refreshToken=" + refreshToken;
            logger.info("[STEP 6] Redirecting to Frontend Dashboard");
            getRedirectStrategy().sendRedirect(request, response, targetUrl);

        } catch (Exception e) {
            logger.error("\n!!! [OAUTH-ERROR CRITICAL] !!!");
            logger.error("Error Type: {}", e.getClass().getName());
            logger.error("Error Message: {}", e.getMessage(), e);
            response.sendRedirect("http://localhost:5173/login?error=auth_failed");
        }
    }
}
