package com.telemedicina.controllers;

import com.telemedicina.models.HealthRecord;
import com.telemedicina.models.Patient;
import com.telemedicina.repositories.HealthRecordRepository;
import com.telemedicina.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.telemedicina.services.HealthRecordService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PatientRepository patientRepository; // To fetch patient from the database

    @Autowired
    private HealthRecordService healthRecordService;

    @PostMapping
    public HealthRecord addHealthRecord(@RequestBody HealthRecord record) {
        // Log the incoming health record
        System.out.println("Received Health Record: " + record);

        // Fetch the patient by ID from the repository
        Optional<Patient> patientOpt = patientRepository.findById(record.getPatient().getId());

        // Log the patient search process
        System.out.println("Attempting to find patient with ID: " + record.getPatient().getId());

        if (!patientOpt.isPresent()) {
            // Log the error before throwing the exception
            System.out.println("Error: Invalid patient ID - " + record.getPatient().getId());
            throw new IllegalArgumentException("Invalid patient ID");
        }

        // Log successful patient retrieval
        Patient patient = patientOpt.get();
        System.out.println("Found patient: " + patient);

        // Set the patient in the health record
        record.setPatient(patient);
        System.out.println("Assigned patient to health record: " + record);

        // Save and return the health record
        HealthRecord savedRecord = healthRecordRepository.save(record);
        System.out.println("Health record saved successfully: " + savedRecord);

        // Return the saved health record
        return savedRecord;
    }


    @GetMapping
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordRepository.findAll(); // Fetch all health records
    }

}
