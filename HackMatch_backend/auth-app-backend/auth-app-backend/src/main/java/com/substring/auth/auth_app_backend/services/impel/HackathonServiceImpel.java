package com.substring.auth.auth_app_backend.services.impel;

import com.substring.auth.auth_app_backend.dtos.HackathonDto;
import com.substring.auth.auth_app_backend.entities.Hackathon;
import com.substring.auth.auth_app_backend.entities.User;
import com.substring.auth.auth_app_backend.exceptions.ResourceNotFound;
import com.substring.auth.auth_app_backend.repositories.HackathonRepository;
import com.substring.auth.auth_app_backend.repositories.UserRepository;
import com.substring.auth.auth_app_backend.services.HackathonService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HackathonServiceImpel implements HackathonService {
    private final UserRepository userRepository;
    private final HackathonRepository hackathonRepository;
    private final ModelMapper modelMapper;
    
    @Override
    public HackathonDto addHackathon(HackathonDto dto, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
        .orElseThrow(()-> new  ResourceNotFound("Organizer not found!"));
        Hackathon hackathon = modelMapper.map(dto, Hackathon.class);

        hackathon.setOrganizer(organizer);

        return modelMapper.map(hackathonRepository.save(hackathon), HackathonDto.class);
        
    }

    @Override
    public List<HackathonDto> getAllHackathons() {
       return hackathonRepository.findAll().stream()
       .map(h -> modelMapper.map(h, HackathonDto.class))
       .toList();

    }


    @Override
    public HackathonDto getHackathonById(String id) {
     Hackathon h = hackathonRepository.findById(UUID.fromString(id))
     .orElseThrow(()-> new ResourceNotFound("Hackathon not found!"));
     return modelMapper.map(h , HackathonDto.class);
}
}