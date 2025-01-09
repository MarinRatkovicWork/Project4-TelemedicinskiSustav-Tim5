package com.telemedicina.controllers;

import com.telemedicina.models.Doctor;
import com.telemedicina.services.DoctorService;
import com.telemedicina.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final AuthService authService;

    @Autowired
    public DoctorController(DoctorService doctorService, AuthService authService) {
        this.doctorService = doctorService;
        this.authService = authService;
    }

    // Endpoint to get all doctors only for Admins
    @GetMapping("/")
    public List<Doctor> getAllDoctors(@RequestHeader("Authorization") String authToken) {
        // Check if the token is valid and the user is an Admin
        if (authService.isAdmin(authToken)) {
            return doctorService.getAllDoctors();
        } else {
            throw new RuntimeException("You do not have permission to access this resource.");
        }
    }
}
