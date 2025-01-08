package com.telemedicina.services;

import com.telemedicina.models.HealthRecord;
import com.telemedicina.repositories.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    // Fetch the most recent health records
    public List<HealthRecord> getRecentHealthRecords() {
        return healthRecordRepository.findTop10ByOrderByDateDesc(); // Fetch recent 10 records
    }
}
