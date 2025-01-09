package com.telemedicina.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

// Patient Model
@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName; // Renamed from 'name' to 'firstName'

    @Column(nullable = false)
    private String lastName; // Renamed from 'surname' to 'lastName'

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    @JsonBackReference
    private Doctor doctor;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<HealthRecord> healthRecords;

    // Default constructor
    public Patient() {
    }

    // Parameterized constructor
    public Patient(Long id, String firstName, String lastName, String email, String password, Doctor doctor, List<HealthRecord> healthRecords) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName; // Updated field
        this.email = email;
        this.password = password;
        this.doctor = doctor;
        this.healthRecords = healthRecords;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() { // Updated getter method
        return firstName;
    }

    public void setFirstName(String firstName) { // Updated setter method
        this.firstName = firstName;
    }

    public String getLastName() { // Updated getter method
        return lastName;
    }

    public void setLastName(String lastName) { // Updated setter method
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public List<HealthRecord> getHealthRecords() {
        return healthRecords;
    }

    public void setHealthRecords(List<HealthRecord> healthRecords) {
        this.healthRecords = healthRecords;
    }
}
