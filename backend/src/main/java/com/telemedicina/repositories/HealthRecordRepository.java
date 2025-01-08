package com.telemedicina.repositories;

import com.telemedicina.models.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    // Fetch the recent health records (You can add any specific criteria for "recent" records)
    List<HealthRecord> findTop10ByOrderByDateDesc(); // Fetches the most recent 10 records, sorted by date
}