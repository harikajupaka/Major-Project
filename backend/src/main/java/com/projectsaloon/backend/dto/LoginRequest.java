package com.projectsaloon.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Mobile number is required")
    @Schema(example = "+919876543210")
    private String mobileNumber;

    @NotBlank(message = "Password is required")
    @Schema(example = "password123")
    private String password;

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
