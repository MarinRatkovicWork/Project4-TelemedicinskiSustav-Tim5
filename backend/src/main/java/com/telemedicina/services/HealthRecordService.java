package com.telemedicina.services;

import com.telemedicina.models.HealthRecord;
import com.telemedicina.repositories.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;

    @Autowired
    public HealthRecordService(HealthRecordRepository healthRecordRepository) {
        this.healthRecordRepository = healthRecordRepository;
    }

    // Update method to use 'dateTime'
    public List<HealthRecord> getAllHealthRecordsByPatientId(Long patientId) {
        return healthRecordRepository.findByPatientIdOrderByDateTimeDesc(patientId);
    }

    // Update method to use 'dateTime'
    public List<HealthRecord> getLast10HealthRecordsByPatientId(Long patientId) {
        return healthRecordRepository.findTop10ByPatientIdOrderByDateTimeDesc(patientId);
    }

    public HealthRecord addHealthRecord(HealthRecord healthRecord) {
        return healthRecordRepository.save(healthRecord);
    }

    public void deleteHealthRecord(Long recordId) {
        healthRecordRepository.deleteById(recordId);
    }

    public HealthRecord updateHealthRecord(Long recordId, HealthRecord updatedRecord) {
        HealthRecord existingRecord = healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Health record not found"));
        existingRecord.setDateTime(updatedRecord.getDateTime());
        existingRecord.setHeartRate(updatedRecord.getHeartRate());
        existingRecord.setBloodPressure(updatedRecord.getBloodPressure());
        existingRecord.setBloodSugar(updatedRecord.getBloodSugar());
        return healthRecordRepository.save(existingRecord);
    }
}
