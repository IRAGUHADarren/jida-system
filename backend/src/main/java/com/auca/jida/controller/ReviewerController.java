package com.auca.jida.controller;

import com.auca.jida.model.Review;
import com.auca.jida.model.User;
import com.auca.jida.service.ReviewerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviewers")
@CrossOrigin(origins = "*")
public class ReviewerController {
    @Autowired
    private ReviewerService reviewerService;

    @GetMapping("/assignments")
    public ResponseEntity<List<Review>> getMyAssignments() {
        return ResponseEntity.ok(reviewerService.getMyAssignments());
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<?> getReview(@PathVariable Long id) {
        Optional<Review> review = reviewerService.getReview(id);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/assignments/{id}/status")
    public ResponseEntity<?> updateReviewStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            Review.ReviewStatus status = Review.ReviewStatus.valueOf(request.get("status"));
            Review review = reviewerService.updateReviewStatus(id, status);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    @PostMapping("/assignments/{id}/submit")
    public ResponseEntity<?> submitReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            Review.Recommendation recommendation = Review.Recommendation.valueOf(request.get("recommendation"));
            Review review = reviewerService.submitReview(
                    id,
                    request.get("commentsToAuthor"),
                    request.get("commentsToEditor"),
                    recommendation
            );
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Submission failed: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Review>> getReviewHistory() {
        return ResponseEntity.ok(reviewerService.getReviewHistory());
    }

    @GetMapping("/assignments/{id}/download")
    public ResponseEntity<?> downloadManuscript(@PathVariable Long id) {
        try {
            Optional<Review> reviewOpt = reviewerService.getReview(id);
            if (reviewOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Review review = reviewOpt.get();
            var manuscript = review.getManuscript();
            java.nio.file.Path filePath = java.nio.file.Paths.get("uploads/" + manuscript.getFilePath());

            if (!Files.exists(filePath)) {
                filePath = java.nio.file.Paths.get("backend/uploads/" + manuscript.getFilePath());
            }

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", manuscript.getFileName());

            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Download failed: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        try {
            User user = reviewerService.updateProfile(request.get("fullName"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }
}

