package com.telemedicina.controllers;

import com.telemedicina.models.HealthRecord;
import com.telemedicina.repositories.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @PostMapping
    public HealthRecord addHealthRecord(@RequestBody HealthRecord record) {
        return healthRecordRepository.save(record); // Spremanje u bazu i vraćanje spremljenog objekta
    }

    @GetMapping
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordRepository.findAll(); // Dohvaćanje svih zdravstvenih zapisa
    }
}

