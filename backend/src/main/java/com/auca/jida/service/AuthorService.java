package com.auca.jida.service;

import com.auca.jida.model.Manuscript;
import com.auca.jida.model.SubmissionDeadline;
import com.auca.jida.model.User;
import com.auca.jida.repository.ManuscriptRepository;
import com.auca.jida.repository.SubmissionDeadlineRepository;
import com.auca.jida.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthorService {
    @Autowired
    private ManuscriptRepository manuscriptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SubmissionDeadlineRepository deadlineRepository;

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Manuscript submitManuscript(String title, String abstractText, String keywords, 
                                      String references, MultipartFile file) throws Exception {
        User author = getCurrentUser();
        
        String fileName = fileStorageService.storeFile(file);
        String filePath = fileName;

        Manuscript manuscript = new Manuscript();
        manuscript.setTitle(title);
        manuscript.setAbstractText(abstractText);
        manuscript.setKeywords(keywords);
        manuscript.setReferences(references);
        manuscript.setFileName(file.getOriginalFilename());
        manuscript.setFilePath(filePath);
        manuscript.setAuthor(author);
        manuscript.setStatus(Manuscript.ManuscriptStatus.SUBMITTED);

        manuscript = manuscriptRepository.save(manuscript);

        // Notify editors
        List<User> editors = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.EDITOR)
                .toList();
        for (User editor : editors) {
            emailService.sendNewSubmissionNotification(editor.getEmail(), title);
        }

        return manuscript;
    }

    public List<Manuscript> getMyManuscripts() {
        User author = getCurrentUser();
        return manuscriptRepository.findByAuthor(author);
    }

    public Optional<Manuscript> getManuscript(Long id) {
        User author = getCurrentUser();
        return manuscriptRepository.findById(id)
                .filter(m -> m.getAuthor().getId().equals(author.getId()));
    }

    public Manuscript updateManuscript(Long id, String title, String abstractText, 
                                      String keywords, String references, MultipartFile file) throws Exception {
        User author = getCurrentUser();
        Manuscript manuscript = manuscriptRepository.findById(id)
                .filter(m -> m.getAuthor().getId().equals(author.getId()))
                .orElseThrow(() -> new RuntimeException("Manuscript not found"));

        if (title != null) manuscript.setTitle(title);
        if (abstractText != null) manuscript.setAbstractText(abstractText);
        if (keywords != null) manuscript.setKeywords(keywords);
        if (references != null) manuscript.setReferences(references);
        
        if (file != null && !file.isEmpty()) {
            fileStorageService.deleteFile(manuscript.getFilePath());
            String fileName = fileStorageService.storeFile(file);
            manuscript.setFileName(file.getOriginalFilename());
            manuscript.setFilePath(fileName);
        }

        return manuscriptRepository.save(manuscript);
    }

    public List<Manuscript> searchManuscripts(String query) {
        User author = getCurrentUser();
        List<Manuscript> allManuscripts = manuscriptRepository.findByAuthor(author);
        
        if (query == null || query.isEmpty()) {
            return allManuscripts;
        }

        String lowerQuery = query.toLowerCase();
        return allManuscripts.stream()
                .filter(m -> m.getTitle().toLowerCase().contains(lowerQuery) ||
                           (m.getAbstractText() != null && m.getAbstractText().toLowerCase().contains(lowerQuery)) ||
                           (m.getKeywords() != null && m.getKeywords().toLowerCase().contains(lowerQuery)))
                .toList();
    }

    public Optional<SubmissionDeadline> getSubmissionDeadline() {
        return deadlineRepository.findFirstByOrderByDeadlineDesc();
    }

    public User updateProfile(String fullName) {
        User user = getCurrentUser();
        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }
        return userRepository.save(user);
    }
}

