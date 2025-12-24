package com.auca.jida.repository;

import com.auca.jida.model.Manuscript;
import com.auca.jida.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManuscriptRepository extends JpaRepository<Manuscript, Long> {
    List<Manuscript> findByAuthor(User author);
    List<Manuscript> findByEditor(User editor);
    List<Manuscript> findByStatus(Manuscript.ManuscriptStatus status);
}

