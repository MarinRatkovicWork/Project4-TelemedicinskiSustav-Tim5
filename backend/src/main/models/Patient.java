package src.main.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<HealthRecord> healthRecords;

    // Getters and Setters
}
