package com.substring.auth.auth_app_backend.security;

import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.exceptions.ResourceNotFound;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
//ye hmne isiliye lgaya taki jo userrepository hmne call kri hai vo ho jaye means uska
//constructor khudse bn jaye hme na bnana pde
public class CustomUserDetails implements UserDetailsService {

    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(()-> new ResourceNotFound("Invalid Email or Password"));
        return user;
    }
}
