package com.auca.jida.repository;

import com.auca.jida.model.Issue;
import com.auca.jida.model.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByJournal(Journal journal);
}

