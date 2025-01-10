package com.telemedicina.controllers;

import com.telemedicina.models.HealthRecord;
import com.telemedicina.models.Patient;
import com.telemedicina.services.AuthService;
import com.telemedicina.services.HealthRecordService;
import com.telemedicina.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final AuthService authService;
    private final HealthRecordService healthRecordService;

    @Autowired
    public PatientController(PatientService patientService, AuthService authService, HealthRecordService healthRecordService) {
        this.patientService = patientService;
        this.authService = authService;
        this.healthRecordService = healthRecordService;
    }

    @GetMapping("/")
    public List<Map<String, Object>> getAllPatients(@RequestHeader("Authorization") String authToken) {
        if (authService.isAdmin(authToken)) {
            List<Patient> patients = patientService.getAllPatients();

            // List to hold the response data
            List<Map<String, Object>> response = new ArrayList<>();

            for (Patient patient : patients) {
                Map<String, Object> patientData = new HashMap<>();
                patientData.put("firstName", patient.getFirstName());
                patientData.put("lastName", patient.getLastName());
                patientData.put("email", patient.getEmail());

                // Get doctor name (firstName + lastName)
                String doctorName = (patient.getDoctor() != null)
                        ? patient.getDoctor().getFirstName() + " " + patient.getDoctor().getLastName()
                        : "No doctor assigned";

                patientData.put("doctorName", doctorName);

                // Add the patient data to the response
                response.add(patientData);
            }

            return response;
        } else {
            throw new RuntimeException("You do not have permission to access this resource.");
        }
    }


    // Endpoint to create a new patient
    @PostMapping("/")
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    // Endpoint to get all health records for a patient
    @GetMapping("/{patientId}/health-records")
    public List<HealthRecord> getAllHealthRecords(@PathVariable Long patientId) {
        return healthRecordService.getAllHealthRecordsByPatientId(patientId);

    }

    // Endpoint to get the last 10 health records by date
    @GetMapping("/{patientId}/health-records/recent")
    public List<HealthRecord> getLast10HealthRecords(@PathVariable Long patientId) {
        return healthRecordService.getLast10HealthRecordsByPatientId(patientId);
    }

    // Endpoint to add a new health record
    @PostMapping("/{patientId}/health-records")
    public HealthRecord addHealthRecord(@PathVariable Long patientId, @RequestBody HealthRecord healthRecord) {
        healthRecord.setPatient(patientService.getPatientById(patientId));
        return healthRecordService.addHealthRecord(healthRecord);
    }

    // Endpoint to delete a health record
    @DeleteMapping("/health-records/{recordId}")
    public void deleteHealthRecord(@PathVariable Long recordId) {
        healthRecordService.deleteHealthRecord(recordId);
    }

    // Endpoint to update a health record
    @PutMapping("/health-records/{recordId}")
    public HealthRecord updateHealthRecord(@PathVariable Long recordId, @RequestBody HealthRecord healthRecord) {
        return healthRecordService.updateHealthRecord(recordId, healthRecord);
    }
}
