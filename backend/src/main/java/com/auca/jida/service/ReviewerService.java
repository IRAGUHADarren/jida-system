package com.auca.jida.service;

import com.auca.jida.model.Review;
import com.auca.jida.model.User;
import com.auca.jida.repository.ManuscriptRepository;
import com.auca.jida.repository.ReviewRepository;
import com.auca.jida.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewerService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ManuscriptRepository manuscriptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Review> getMyAssignments() {
        User reviewer = getCurrentUser();
        return reviewRepository.findByReviewer(reviewer);
    }

    public Optional<Review> getReview(Long reviewId) {
        User reviewer = getCurrentUser();
        return reviewRepository.findById(reviewId)
                .filter(r -> r.getReviewer().getId().equals(reviewer.getId()));
    }

    public Review updateReviewStatus(Long reviewId, Review.ReviewStatus status) {
        User reviewer = getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .filter(r -> r.getReviewer().getId().equals(reviewer.getId()))
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setStatus(status);
        return reviewRepository.save(review);
    }

    public Review submitReview(Long reviewId, String commentsToAuthor, String commentsToEditor, 
                              Review.Recommendation recommendation) {
        User reviewer = getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .filter(r -> r.getReviewer().getId().equals(reviewer.getId()))
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setCommentsToAuthor(commentsToAuthor);
        review.setCommentsToEditor(commentsToEditor);
        review.setRecommendation(recommendation);
        review.setStatus(Review.ReviewStatus.FINISHED_REVIEW);
        review.setSubmittedAt(LocalDateTime.now());

        review = reviewRepository.save(review);

        // Notify editor
        if (review.getManuscript().getEditor() != null) {
            emailService.sendEmail(
                    review.getManuscript().getEditor().getEmail(),
                    "Review Completed",
                    String.format("Reviewer has completed review for manuscript: %s", 
                            review.getManuscript().getTitle())
            );
        }

        return review;
    }

    public List<Review> getReviewHistory() {
        User reviewer = getCurrentUser();
        return reviewRepository.findByReviewer(reviewer);
    }

    public User updateProfile(String fullName) {
        User user = getCurrentUser();
        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }
        return userRepository.save(user);
    }
}

