package com.auca.jida.service;

import com.auca.jida.model.*;
import com.auca.jida.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EditorService {
    @Autowired
    private ManuscriptRepository manuscriptRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private EmailService emailService;

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Manuscript> getNewSubmissions() {
        return manuscriptRepository.findByStatus(Manuscript.ManuscriptStatus.SUBMITTED);
    }

    public List<Manuscript> getAllManuscripts() {
        return manuscriptRepository.findAll();
    }

    public Optional<Manuscript> getManuscript(Long id) {
        return manuscriptRepository.findById(id);
    }

    public Review assignReviewer(Long manuscriptId, Long reviewerId, LocalDateTime deadline) {
        User editor = getCurrentUser();
        Manuscript manuscript = manuscriptRepository.findById(manuscriptId)
                .orElseThrow(() -> new RuntimeException("Manuscript not found"));
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        if (reviewer.getRole() != User.Role.REVIEWER) {
            throw new RuntimeException("User is not a reviewer");
        }

        // Check if review already exists
        Optional<Review> existingReview = reviewRepository.findByManuscriptIdAndReviewerId(manuscriptId, reviewerId);
        if (existingReview.isPresent()) {
            throw new RuntimeException("Reviewer already assigned to this manuscript");
        }

        Review review = new Review();
        review.setManuscript(manuscript);
        review.setReviewer(reviewer);
        review.setDeadline(deadline);
        review.setStatus(Review.ReviewStatus.NOT_STARTED);

        review = reviewRepository.save(review);

        manuscript.setStatus(Manuscript.ManuscriptStatus.UNDER_REVIEW);
        manuscript.setEditor(editor);
        manuscriptRepository.save(manuscript);

        // Notify reviewer
        emailService.sendReviewAssignment(
                reviewer.getEmail(),
                manuscript.getTitle(),
                deadline.toString()
        );

        return review;
    }

    public Manuscript makeDecision(Long manuscriptId, Manuscript.ManuscriptStatus decision, String comments) {
        User editor = getCurrentUser();
        Manuscript manuscript = manuscriptRepository.findById(manuscriptId)
                .orElseThrow(() -> new RuntimeException("Manuscript not found"));

        manuscript.setStatus(decision);
        manuscript = manuscriptRepository.save(manuscript);

        // Notify author
        emailService.sendManuscriptStatusChange(
                manuscript.getAuthor().getEmail(),
                manuscript.getTitle(),
                decision.name()
        );

        return manuscript;
    }

    public Issue createIssue(Long journalId, String volume, String number, LocalDate publicationDate) {
        Journal journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new RuntimeException("Journal not found"));

        Issue issue = new Issue();
        issue.setJournal(journal);
        issue.setVolume(volume);
        issue.setNumber(number);
        issue.setPublicationDate(publicationDate);

        return issueRepository.save(issue);
    }

    public Manuscript publishManuscript(Long manuscriptId, Long issueId, String googleScholarUrl) {
        Manuscript manuscript = manuscriptRepository.findById(manuscriptId)
                .orElseThrow(() -> new RuntimeException("Manuscript not found"));

        if (issueId != null) {
            Issue issue = issueRepository.findById(issueId)
                    .orElseThrow(() -> new RuntimeException("Issue not found"));
            manuscript.setIssue(issue);
        }

        manuscript.setStatus(Manuscript.ManuscriptStatus.ACCEPTED);
        manuscript.setPublishedAt(LocalDateTime.now());
        manuscript.setGoogleScholarUrl(googleScholarUrl);

        return manuscriptRepository.save(manuscript);
    }

    public Journal createJournal(String name, String description) {
        Journal journal = new Journal();
        journal.setName(name);
        journal.setDescription(description);
        return journalRepository.save(journal);
    }

    public List<Journal> getAllJournals() {
        return journalRepository.findAll();
    }

    public User updateProfile(String fullName) {
        User user = getCurrentUser();
        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }
        return userRepository.save(user);
    }
}

