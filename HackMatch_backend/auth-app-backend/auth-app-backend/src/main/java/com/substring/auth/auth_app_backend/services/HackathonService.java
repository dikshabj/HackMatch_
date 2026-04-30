package com.substring.auth.auth_app_backend.services;

import com.substring.auth.auth_app_backend.dtos.HackathonDto;
import java.util.List;
public interface HackathonService {
    HackathonDto addHackathon(HackathonDto dto , String organizerEmail);
    List<HackathonDto> getAllHackathons();
    HackathonDto getHackathonById(String id);
    


    
}
