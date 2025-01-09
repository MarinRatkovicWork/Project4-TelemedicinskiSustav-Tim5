package com.telemedicina.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.telemedicina.models.Admin;
import com.telemedicina.models.Doctor;
import com.telemedicina.models.LoginRequest;
import com.telemedicina.models.Patient;
import com.telemedicina.repositories.AdminRepository;
import com.telemedicina.repositories.DoctorRepository;
import com.telemedicina.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String SECRET_KEY = "my-secret-key645555555555555555555555555545666666666666666666666666666666666666666666666665";
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AdminRepository adminRepository;


    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin newAdmin) {
        // Provjera da li admin s istim emailom već postoji
        Optional<Admin> existingAdmin = adminRepository.findByEmail(newAdmin.getEmail());
        if (existingAdmin.isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use!");
        }

        // Ako email nije zauzet, spremanje novog admina u bazu
        adminRepository.save(newAdmin);
        return ResponseEntity.ok("Admin registered successfully.");
    }

    // Generate JWT Token using a secure key
    public String generateJwtToken(String email) {
        long expirationTime = 1000 * 60 * 60 * 10; // 10 hours

        // Use a fixed secret key for both signing and validation
        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey) // Use the same secret key to sign the token
                .compact();
    }

    // Extract email from the JWT Token
    public String extractEmailFromToken(String token) {
        // Use the same secret key for validation
        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        return Jwts.parser()
                .setSigningKey(secretKey) // Use the same key to parse the token
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Email is set as the subject in the token
    }

    // Login method
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Check in the admin databases
        Optional<Admin> existingAdmin = adminRepository.findByEmail(email);
        if (existingAdmin.isPresent() && existingAdmin.get().getPassword().equals(password)) {
            String token = generateJwtToken(email); // Generate JWT token
            return ResponseEntity.ok("Admin : Token: " + token);
        }

        // Check in the doctor database
        Optional<Doctor> existingDoctor = doctorRepository.findByEmail(email);
        if (existingDoctor.isPresent() && existingDoctor.get().getPassword().equals(password)) {
            String token = generateJwtToken(email); // Generate JWT token
            return ResponseEntity.ok("Doctor : Token: " + token);
        }

        // Check in the patient database
        Optional<Patient> existingPatient = patientRepository.findByEmail(email);
        if (existingPatient.isPresent() && existingPatient.get().getPassword().equals(password)) {
            String token = generateJwtToken(email); // Generate JWT token
            return ResponseEntity.ok("Patient : Token: " + token);
        }

        // If no match found for email and password
        return ResponseEntity.status(401).body("Invalid email or password!");
    }

    // Register method for adding doctors and patients
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request, @RequestParam String role, @RequestHeader("Authorization") String authToken) {
        // Check for authorized user (admin or doctor)
        if (authToken == null || authToken.isBlank()) {
            return ResponseEntity.status(403).body("Authorization token is required!");
        }

        // Decode the token and extract the email
        String email = extractEmailFromToken(authToken.replace("Bearer ", ""));
        Optional<Admin> existingAdmin = adminRepository.findByEmail(email);
        Optional<Doctor> existingDoctor = doctorRepository.findByEmail(email);

        if (role == null || role.isBlank()) {
            return ResponseEntity.badRequest().body("Role is required!");
        }

        // Extract model type and data from the request body
        String type = (String) request.get("type");
        Map<String, Object> data = (Map<String, Object>) request.get("data");

        // Check if type is specified
        if (type == null || data == null) {
            return ResponseEntity.badRequest().body("Both 'type' and 'data' are required.");
        }

        // Admin registration
        if (role.equalsIgnoreCase("admin")) {
            if (existingAdmin.isPresent()) {
                // Check if the email already exists in Doctor or Patient
                String emailToCheck = (String) data.get("email");
                if (doctorRepository.findByEmail(emailToCheck).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already exists in doctor database!");
                }
                if (patientRepository.findByEmail(emailToCheck).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already exists in patient database!");
                }

                if (type.equalsIgnoreCase("patient")) {
                    // Handle patient registration
                    Patient patient = new ObjectMapper().convertValue(data, Patient.class);
                    patientRepository.save(patient);
                    return ResponseEntity.ok("Patient registered successfully by admin.");
                } else if (type.equalsIgnoreCase("doctor")) {
                    // Handle doctor registration
                    Doctor doctor = new ObjectMapper().convertValue(data, Doctor.class);
                    doctorRepository.save(doctor);
                    return ResponseEntity.ok("Doctor registered successfully by admin.");
                } else {
                    return ResponseEntity.badRequest().body("Invalid type. Only 'doctor' or 'patient' allowed.");
                }
            } else {
                return ResponseEntity.status(403).body("Only logged-in admin can register users.");
            }
        }

        // Doctor registration
        else if (role.equalsIgnoreCase("doctor")) {
            if (existingDoctor.isPresent()) {
                // Check if the email already exists in Patient repository
                String emailToCheck = (String) data.get("email");
                if (doctorRepository.findByEmail(emailToCheck).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already exists in doctor database!");
                }
                if (patientRepository.findByEmail(emailToCheck).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already exists in patient database!");
                }

                if (type.equalsIgnoreCase("patient")) {
                    // Handle patient registration by doctor
                    Patient patient = new ObjectMapper().convertValue(data, Patient.class);
                    patientRepository.save(patient);
                    return ResponseEntity.ok("Patient registered successfully by doctor.");
                } else {
                    return ResponseEntity.status(403).body("Doctors can only register patients.");
                }
            } else {
                return ResponseEntity.status(403).body("Only logged-in doctor can register patients.");
            }
        } else {
            return ResponseEntity.status(403).body("Invalid role! Only 'admin' and 'doctor' can register users.");
        }
    }
}

