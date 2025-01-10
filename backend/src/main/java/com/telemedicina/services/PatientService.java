package com.telemedicina.services;

import com.telemedicina.models.HealthRecord;
import com.telemedicina.models.Patient;
import com.telemedicina.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Method to get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Method to create a new patient
    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // Method to get patients by doctor ID
    public List<Patient> getPatientsByDoctorId(Long doctorId) {
        return patientRepository.findByDoctorId(doctorId);
    }

    public Patient getPatientById(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
    }

    public boolean isPatientAssignedToDoctor(Long patientId, Long doctorId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return patient.getDoctor().getId().equals(doctorId);
    }

    public List<HealthRecord> getHealthRecordsByPatientId(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return patient.getHealthRecords(); // Pretpostavka: Patient entitet ima povezane HealthRecord objekte
    }
    public void savePatient(Patient patient) {
        patientRepository.save(patient);
    }
}

