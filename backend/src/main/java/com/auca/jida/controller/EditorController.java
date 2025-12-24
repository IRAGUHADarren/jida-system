package com.auca.jida.controller;

import com.auca.jida.model.*;
import com.auca.jida.service.EditorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/editors")
@CrossOrigin(origins = "*")
public class EditorController {
    @Autowired
    private EditorService editorService;

    @GetMapping("/submissions")
    public ResponseEntity<List<Manuscript>> getNewSubmissions() {
        return ResponseEntity.ok(editorService.getNewSubmissions());
    }

    @GetMapping("/manuscripts")
    public ResponseEntity<List<Manuscript>> getAllManuscripts() {
        return ResponseEntity.ok(editorService.getAllManuscripts());
    }

    @GetMapping("/manuscripts/{id}")
    public ResponseEntity<?> getManuscript(@PathVariable Long id) {
        Optional<Manuscript> manuscript = editorService.getManuscript(id);
        return manuscript.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/manuscripts/{manuscriptId}/assign-reviewer")
    public ResponseEntity<?> assignReviewer(
            @PathVariable Long manuscriptId,
            @RequestBody Map<String, Object> request) {
        try {
            Long reviewerId = Long.valueOf(request.get("reviewerId").toString());
            LocalDateTime deadline = LocalDateTime.parse(request.get("deadline").toString());
            
            Review review = editorService.assignReviewer(manuscriptId, reviewerId, deadline);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Assignment failed: " + e.getMessage());
        }
    }

    @PostMapping("/manuscripts/{id}/decision")
    public ResponseEntity<?> makeDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            Manuscript.ManuscriptStatus decision = Manuscript.ManuscriptStatus.valueOf(request.get("decision"));
            Manuscript manuscript = editorService.makeDecision(id, decision, request.get("comments"));
            return ResponseEntity.ok(manuscript);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Decision failed: " + e.getMessage());
        }
    }

    @PostMapping("/journals")
    public ResponseEntity<?> createJournal(@RequestBody Map<String, String> request) {
        try {
            Journal journal = editorService.createJournal(request.get("name"), request.get("description"));
            return ResponseEntity.ok(journal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Creation failed: " + e.getMessage());
        }
    }

    @GetMapping("/journals")
    public ResponseEntity<List<Journal>> getAllJournals() {
        return ResponseEntity.ok(editorService.getAllJournals());
    }

    @PostMapping("/issues")
    public ResponseEntity<?> createIssue(@RequestBody Map<String, Object> request) {
        try {
            Long journalId = Long.valueOf(request.get("journalId").toString());
            String volume = request.get("volume").toString();
            String number = request.get("number").toString();
            LocalDate publicationDate = LocalDate.parse(request.get("publicationDate").toString());
            
            Issue issue = editorService.createIssue(journalId, volume, number, publicationDate);
            return ResponseEntity.ok(issue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Creation failed: " + e.getMessage());
        }
    }

    @PostMapping("/manuscripts/{id}/publish")
    public ResponseEntity<?> publishManuscript(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long issueId = request.get("issueId") != null ? 
                    Long.valueOf(request.get("issueId").toString()) : null;
            String googleScholarUrl = request.get("googleScholarUrl") != null ? 
                    request.get("googleScholarUrl").toString() : null;
            
            Manuscript manuscript = editorService.publishManuscript(id, issueId, googleScholarUrl);
            return ResponseEntity.ok(manuscript);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Publishing failed: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        try {
            User user = editorService.updateProfile(request.get("fullName"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }
}

