package src.main.repositories;

import src.main.models.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
}
