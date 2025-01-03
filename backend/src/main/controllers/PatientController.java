package src.main.controllers;

import src.main.models.Patient;
import src.main.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }
}
