package com.telemedicina.controllers;

import com.telemedicina.models.Patient;
import com.telemedicina.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient patient) {
        // Provjera postoji li već pacijent s istim emailom
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use!");
        }

        // Osiguravanje da lista zdravstvenih zapisa nije null
        if (patient.getHealthRecords() == null) {
            patient.setHealthRecords(List.of());
        }

        // Validacija lozinke
        if (patient.getPassword() == null || patient.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password cannot be empty!");
        }

        // Spremanje pacijenta u bazu podataka
        patientRepository.save(patient);

        // Vraćanje uspješnog odgovora
        return ResponseEntity.ok(
                String.format("Registration successful! Patient Name: %s, Email: %s",
                        patient.getName(),
                        patient.getEmail(),
                        patient.getPassword())
        );
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient patient) {
        // Prvo provjeri postoji li pacijent s danim emailom
        Optional<Patient> existingPatient = patientRepository.findByEmail(patient.getEmail());
        if (existingPatient.isPresent()) {
            System.out.println("Pacijent s emailom " + patient.getEmail() + " pronađen.");

            // Provjeri da li je lozinka ispravna (koristi odgovarajuću metodu za provjeru lozinke)
            if (existingPatient.get().getPassword().equals(patient.getPassword())) {
                System.out.println("Lozinka je ispravna za pacijenta " + patient.getEmail());
                // Ako je lozinka ispravna, vrati pacijenta
                return ResponseEntity.ok(existingPatient.get());
            } else {
                System.out.println("Neispravna lozinka za pacijenta " + patient.getEmail());
                // Ako lozinka nije ispravna
                return ResponseEntity.status(401).body("Invalid password!");
            }
        }
        // Ako pacijent s tim emailom ne postoji
        System.out.println("Pacijent s emailom " + patient.getEmail() + " nije pronađen.");
        return ResponseEntity.status(401).body("Invalid email!");
    }

}
