package com.telemedicina.services;

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


}
