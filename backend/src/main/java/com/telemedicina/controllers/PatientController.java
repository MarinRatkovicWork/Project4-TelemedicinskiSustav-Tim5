package com.telemedicina.controllers;

import com.telemedicina.models.Patient;
import com.telemedicina.services.PatientService;
import com.telemedicina.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final AuthService authService;

    @Autowired
    public PatientController(PatientService patientService, AuthService authService) {
        this.patientService = patientService;
        this.authService = authService;
    }

    // Endpoint to get all patients only for Admins
    @GetMapping("/")
    public List<Patient> getAllPatients(@RequestHeader("Authorization") String authToken) {
        // Check if the token is valid and the user is an Admin
        if (authService.isAdmin(authToken)) {
            return patientService.getAllPatients();
        } else {
            throw new RuntimeException("You do not have permission to access this resource.");
        }
    }

    // Endpoint to create a new patient
    @PostMapping("/")
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }
}
