package com.auca.jida.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "manuscript_id", nullable = false)
    private Manuscript manuscript;

    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Column(columnDefinition = "TEXT")
    private String commentsToAuthor;

    @Column(columnDefinition = "TEXT")
    private String commentsToEditor;

    @Enumerated(EnumType.STRING)
    private Recommendation recommendation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewStatus status;

    private LocalDateTime deadline;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ReviewStatus.NOT_STARTED;
        }
    }

    public enum Recommendation {
        ACCEPT,
        MINOR_REVISION,
        MAJOR_REVISION,
        REJECT
    }

    public enum ReviewStatus {
        NOT_STARTED,
        BEGIN_REVIEW,
        IN_PROGRESS,
        FINISHED_REVIEW
    }
}

