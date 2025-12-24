package com.auca.jida.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendManuscriptStatusChange(String to, String manuscriptTitle, String status) {
        String subject = "Manuscript Status Update";
        String text = String.format(
                "Dear Author,\n\n" +
                "The status of your manuscript '%s' has been updated to: %s\n\n" +
                "Please log in to your account to view more details.\n\n" +
                "Best regards,\nJIDA System",
                manuscriptTitle, status
        );
        sendEmail(to, subject, text);
    }

    public void sendReviewAssignment(String to, String manuscriptTitle, String deadline) {
        String subject = "New Review Assignment";
        String text = String.format(
                "Dear Reviewer,\n\n" +
                "You have been assigned to review the manuscript: '%s'\n" +
                "Deadline: %s\n\n" +
                "Please log in to your account to access the manuscript.\n\n" +
                "Best regards,\nJIDA System",
                manuscriptTitle, deadline
        );
        sendEmail(to, subject, text);
    }

    public void sendReviewDeadlineReminder(String to, String manuscriptTitle, String deadline) {
        String subject = "Review Deadline Approaching";
        String text = String.format(
                "Dear Reviewer,\n\n" +
                "This is a reminder that your review for '%s' is due on: %s\n\n" +
                "Please complete your review as soon as possible.\n\n" +
                "Best regards,\nJIDA System",
                manuscriptTitle, deadline
        );
        sendEmail(to, subject, text);
    }

    public void sendNewSubmissionNotification(String to, String manuscriptTitle) {
        String subject = "New Manuscript Submission";
        String text = String.format(
                "Dear Editor,\n\n" +
                "A new manuscript has been submitted: '%s'\n\n" +
                "Please log in to your account to review and assign reviewers.\n\n" +
                "Best regards,\nJIDA System",
                manuscriptTitle
        );
        sendEmail(to, subject, text);
    }

    public void sendPasswordResetToken(String to, String token) {
        String subject = "Password Reset Request";
        String text = String.format(
                "Dear User,\n\n" +
                "You have requested to reset your password.\n" +
                "Please use the following token to reset your password: %s\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\nJIDA System",
                token
        );
        sendEmail(to, subject, text);
    }
}

