package com.substring.auth.auth_app_backend.dtos;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HackathonDto {
    private UUID id;
    private String title;
    private String description;
    private LocalDate date;
    private String location;
    private String duration;
    private String eligibility;
    private String registrationLink;
    private String rules;
    private String prizes;
    private String contact;
    private String image;
    private String website;
    private String socialMedia;
    private String hashtags;
    private String tags;
    private String category;
    private String type;
    private String status;
    private UserDto organizer;
 
    
}

