package com.example.email_helper.contollers;

import org.springframework.web.bind.annotation.RestController;

import com.example.email_helper.dtos.EmailRequest;
import com.example.email_helper.services.EmailGeneratorService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")    
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        try {
            String response = emailGeneratorService.generateEmailReply(emailRequest);
            log.info("Email response is generated successfully!!!!!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while generating the email: " + e.getMessage());
        }
        
    }
    
}
