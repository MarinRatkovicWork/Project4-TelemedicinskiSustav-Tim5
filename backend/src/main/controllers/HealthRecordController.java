package src.main.controllers;

import src.main.models.HealthRecord;
import src.main.repositories.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @GetMapping
    public List<HealthRecord> getAllRecords() {
        return healthRecordRepository.findAll();
    }

    @PostMapping
    public HealthRecord addHealthRecord(@RequestBody HealthRecord record) {
        return healthRecordRepository.save(record);
    }
}
