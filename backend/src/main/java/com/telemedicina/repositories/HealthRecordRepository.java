package com.telemedicina.repositories;

import com.telemedicina.models.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    // Update this method to use 'dateTime' instead of 'date'
    List<HealthRecord> findByPatientIdOrderByDateTimeDesc(Long patientId);

    // Similarly, update this one as well
    List<HealthRecord> findTop10ByPatientIdOrderByDateTimeDesc(Long patientId);
}

