package com.telemedicina.services;

import  com.telemedicina.repositories.DoctorRepository;
import com.telemedicina.models.Admin;
import com.telemedicina.models.Doctor;
import com.telemedicina.repositories.AdminRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private static final String SECRET_KEY = "my-secret-key645555555555555555555555555545666666666666666666666666666666666666666666666665";

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorRepository doctorRepository;
    // Method to extract email from JWT token
    public String extractEmailFromToken(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Method to verify if the user is an admin
    public boolean isAdmin(String authToken) {
        if (authToken == null || authToken.isBlank()) {
            throw new RuntimeException("Authorization token is required.");
        }

        // Extract the email from the JWT token
        String email = extractEmailFromToken(authToken.replace("Bearer ", ""));
        Optional<Admin> admin = adminRepository.findByEmail(email);

        // Return true if the user is an admin, otherwise false
        return admin.isPresent();
    }

    public Long getAuthenticatedDoctorId(String authToken) {
        // Dekodirajte token kako biste dobili email doktora
        String email = extractEmailFromToken(authToken); // Ovdje koristimo metodu koja već dekodira token
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return doctor.getId();
    }


    private String decodeToken(String token) {
        // Dekodiranje tokena
        return token; // Ovdje implementirajte stvarnu logiku
    }
}
