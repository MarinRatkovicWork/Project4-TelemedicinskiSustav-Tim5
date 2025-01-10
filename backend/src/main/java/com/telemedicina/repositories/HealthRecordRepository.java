package com.telemedicina.repositories;

import com.telemedicina.models.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    List<HealthRecord> findByPatientIdOrderByDateDesc(Long patientId);

    List<HealthRecord> findTop10ByPatientIdOrderByDateDesc(Long patientId);
}
