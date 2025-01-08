package com.telemedicina.controllers;

import com.telemedicina.models.HealthRecord;
import com.telemedicina.models.Patient;
import com.telemedicina.repositories.HealthRecordRepository;
import com.telemedicina.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PatientRepository patientRepository; // To fetch patient from the database

    @PostMapping
    public HealthRecord addHealthRecord(@RequestBody HealthRecord record) {
        // Fetch the patient by ID from the repository
        Optional<Patient> patientOpt = patientRepository.findById(record.getPatient().getId());

        if (!patientOpt.isPresent()) {
            throw new IllegalArgumentException("Invalid patient ID");
        }

        // Set the patient in the health record
        Patient patient = patientOpt.get();
        record.setPatient(patient);

        // Save and return the health record
        return healthRecordRepository.save(record);
    }

    @GetMapping
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordRepository.findAll(); // Fetch all health records
    }
}
