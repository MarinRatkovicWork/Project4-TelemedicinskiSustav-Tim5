package src.main.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Integer heartRate;
    private String bloodPressure;
    private Integer bloodSugar;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    // Getters and Setters
}
