package com.auca.jida.repository;

import com.auca.jida.model.SubmissionDeadline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubmissionDeadlineRepository extends JpaRepository<SubmissionDeadline, Long> {
    Optional<SubmissionDeadline> findFirstByOrderByDeadlineDesc();
}

