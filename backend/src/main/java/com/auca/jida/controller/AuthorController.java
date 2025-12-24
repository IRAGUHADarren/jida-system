package com.auca.jida.controller;

import com.auca.jida.model.Manuscript;
import com.auca.jida.model.SubmissionDeadline;
import com.auca.jida.model.User;
import com.auca.jida.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/authors")
@CrossOrigin(origins = "*")
public class AuthorController {
    @Autowired
    private AuthorService authorService;

    @PostMapping("/manuscripts")
    public ResponseEntity<?> submitManuscript(
            @RequestParam String title,
            @RequestParam(required = false) String abstractText,
            @RequestParam(required = false) String keywords,
            @RequestParam(required = false) String references,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty() || (!file.getContentType().equals("application/pdf") && 
                !file.getContentType().equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                return ResponseEntity.badRequest().body("File must be PDF or DOCX format");
            }

            Manuscript manuscript = authorService.submitManuscript(title, abstractText, keywords, references, file);
            return ResponseEntity.ok(manuscript);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Submission failed: " + e.getMessage());
        }
    }

    @GetMapping("/manuscripts")
    public ResponseEntity<List<Manuscript>> getMyManuscripts() {
        return ResponseEntity.ok(authorService.getMyManuscripts());
    }

    @GetMapping("/manuscripts/{id}")
    public ResponseEntity<?> getManuscript(@PathVariable Long id) {
        Optional<Manuscript> manuscript = authorService.getManuscript(id);
        return manuscript.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/manuscripts/{id}")
    public ResponseEntity<?> updateManuscript(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String abstractText,
            @RequestParam(required = false) String keywords,
            @RequestParam(required = false) String references,
            @RequestParam(required = false) MultipartFile file) {
        try {
            Manuscript manuscript = authorService.updateManuscript(id, title, abstractText, keywords, references, file);
            return ResponseEntity.ok(manuscript);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    @GetMapping("/manuscripts/search")
    public ResponseEntity<List<Manuscript>> searchManuscripts(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(authorService.searchManuscripts(query));
    }

    @GetMapping("/deadline")
    public ResponseEntity<?> getSubmissionDeadline() {
        Optional<SubmissionDeadline> deadline = authorService.getSubmissionDeadline();
        return deadline.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/manuscripts/{id}/download")
    public ResponseEntity<?> downloadManuscript(@PathVariable Long id) {
        try {
            Optional<Manuscript> manuscriptOpt = authorService.getManuscript(id);
            if (manuscriptOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Manuscript manuscript = manuscriptOpt.get();
            java.nio.file.Path filePath = authorService.getCurrentUser().getClass()
                    .getResource("/").getPath().contains("uploads") 
                    ? java.nio.file.Paths.get("uploads/" + manuscript.getFilePath())
                    : java.nio.file.Paths.get("backend/uploads/" + manuscript.getFilePath());

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
            User user = authorService.updateProfile(request.get("fullName"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }
}

