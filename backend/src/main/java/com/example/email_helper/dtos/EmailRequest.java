package com.example.email_helper.dtos;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
