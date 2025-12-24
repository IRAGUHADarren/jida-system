package com.auca.jida.controller;

import com.auca.jida.model.Manuscript;
import com.auca.jida.repository.ManuscriptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {
    @Autowired
    private ManuscriptRepository manuscriptRepository;

    @GetMapping("/articles")
    public ResponseEntity<List<Manuscript>> searchArticles(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String keyword) {
        List<Manuscript> published = manuscriptRepository.findByStatus(Manuscript.ManuscriptStatus.ACCEPTED);

        if (query != null && !query.isEmpty()) {
            String lowerQuery = query.toLowerCase();
            published = published.stream()
                    .filter(m -> m.getTitle().toLowerCase().contains(lowerQuery) ||
                               (m.getAbstractText() != null && m.getAbstractText().toLowerCase().contains(lowerQuery)))
                    .toList();
        }

        if (keyword != null && !keyword.isEmpty()) {
            String lowerKeyword = keyword.toLowerCase();
            published = published.stream()
                    .filter(m -> m.getKeywords() != null && m.getKeywords().toLowerCase().contains(lowerKeyword))
                    .toList();
        }

        return ResponseEntity.ok(published);
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id) {
        return manuscriptRepository.findById(id)
                .filter(m -> m.getStatus() == Manuscript.ManuscriptStatus.ACCEPTED)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/articles/{id}/download")
    public ResponseEntity<?> downloadArticle(@PathVariable Long id) {
        try {
            var manuscriptOpt = manuscriptRepository.findById(id)
                    .filter(m -> m.getStatus() == Manuscript.ManuscriptStatus.ACCEPTED);

            if (manuscriptOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            var manuscript = manuscriptOpt.get();
            var filePath = java.nio.file.Paths.get("uploads/" + manuscript.getFilePath());

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
}

