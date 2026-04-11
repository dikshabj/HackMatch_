package com.substring.auth.auth_app_backend.controllers;

import com.substring.auth.auth_app_backend.dtos.LoginRequest;
import com.substring.auth.auth_app_backend.dtos.UserDto;
import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import com.substring.auth.auth_app_backend.security.JwtService;
import com.substring.auth.auth_app_backend.services.AuthService;
import com.substring.auth.auth_app_backend.services.ForgotPasswordService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.UUID;
import com.substring.auth.auth_app_backend.dtos.TokenResponse;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        // 1. Authenticate using Spring Security
        authenticate(loginRequest);

        // 2. Fetch User from DB
        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid Username or Password"));

        if (!user.isEnable()) {
            throw new DisabledException("User is disabled");
        }

        // 3. Generate Tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // FIX 2: .build method ko sirf ResponseCookie ke end mein lagaya, long value ke
        // sath nahi
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(false) // Production pe true karein (HTTPS)
                .path("/")
                .maxAge(jwtService.getAccessTtlSeconds())
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(jwtService.getRefreshTtlSeconds())
                .build();

        // FIX 3: Ab 'response' variable available hai headers set karne ke liye
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok(TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtService.getAccessTtlSeconds())
                .tokenType("Bearer")
                .userDto(modelMapper.map(user, UserDto.class))
                .build());
    }

    private Authentication authenticate(LoginRequest loginRequest) {
        try {
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid Credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(userDto));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // cookie se refresh token nikalna
        String refreshToken = null;
        if (request.getCookies() != null) {
            refreshToken = Arrays.stream(request.getCookies())
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);

        }
        if (refreshToken == null) {
            throw new BadCredentialsException("Refresh Token missing!");
        }

        try {
            if (jwtService.isRefreshToken(refreshToken)) {
                UUID userId = jwtService.getUserId(refreshToken);
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new BadCredentialsException("User not found"));

                // new access token
                String newAccessToken = jwtService.generateAccessToken(user);

                // new access cookie set kre
                ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(jwtService.getAccessTtlSeconds())
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

                return ResponseEntity.ok("Token refreshed successfully");
            }
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid refresh token");

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
    }

    // 2. logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cleanAccess = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie cleanRefresh = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cleanAccess.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, cleanRefresh.toString());

        return ResponseEntity.ok("Logged out successfully");
    }

    // --- Forgot Password Flow ---

    // 1. Send OTP
    @PostMapping("/forgot-password")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        forgotPasswordService.sendOtp(email);
        return ResponseEntity.ok("OTP sent to your email.");
    }

    // 2. Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isVerified = forgotPasswordService.verifyOtp(email, otp);
        if (isVerified) {
            return ResponseEntity.ok("OTP verified successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP.");
        }
    }

    // 3. Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String otp,
            @RequestParam String newPassword) {
        forgotPasswordService.resetPassword(email, otp, newPassword);
        return ResponseEntity.ok("Password has been reset successfully.");
    }
}