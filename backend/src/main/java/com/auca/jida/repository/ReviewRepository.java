package com.auca.jida.repository;

import com.auca.jida.model.Review;
import com.auca.jida.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewer(User reviewer);
    List<Review> findByManuscriptId(Long manuscriptId);
    Optional<Review> findByManuscriptIdAndReviewerId(Long manuscriptId, Long reviewerId);
}

