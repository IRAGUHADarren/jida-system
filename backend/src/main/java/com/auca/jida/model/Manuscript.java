package com.auca.jida.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "manuscripts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Manuscript {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String abstractText;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Column(columnDefinition = "TEXT")
    private String references;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ManuscriptStatus status;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne
    @JoinColumn(name = "editor_id")
    private User editor;

    @OneToMany(mappedBy = "manuscript", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    private LocalDateTime publishedAt;

    private String googleScholarUrl;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null) {
            status = ManuscriptStatus.SUBMITTED;
        }
    }

    public enum ManuscriptStatus {
        SUBMITTED,
        UNDER_REVIEW,
        ACCEPTED,
        REJECTED,
        REVISION_REQUIRED
    }
}

