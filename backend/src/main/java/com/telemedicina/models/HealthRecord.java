package com.telemedicina.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime; // Promijenjen na LocalDateTime

@Entity
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_time")  // If the column name is 'date_time' in the DB
    private LocalDateTime dateTime;  // Promijenjeno na LocalDateTime

    private Integer heartRate;
    private String bloodPressure;
    private Integer bloodSugar;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonBackReference
    private Patient patient;

    // Default konstruktor
    public HealthRecord() {
    }

    // Konstruktor s parametrima
    public HealthRecord(Long id, LocalDateTime dateTime, Integer heartRate, String bloodPressure, Integer bloodSugar, Patient patient) {
        this.id = id;
        this.dateTime = dateTime;  // Promijenjeno na LocalDateTime
        this.heartRate = heartRate;
        this.bloodPressure = bloodPressure;
        this.bloodSugar = bloodSugar;
        this.patient = patient;
    }

    // Getters i Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateTime() {
        return dateTime;  // Promijenjeno na LocalDateTime
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;  // Promijenjeno na LocalDateTime
    }

    public Integer getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(Integer heartRate) {
        this.heartRate = heartRate;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public Integer getBloodSugar() {
        return bloodSugar;
    }

    public void setBloodSugar(Integer bloodSugar) {
        this.bloodSugar = bloodSugar;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

}
