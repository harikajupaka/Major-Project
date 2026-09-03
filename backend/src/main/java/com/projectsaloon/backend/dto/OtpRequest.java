package com.projectsaloon.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class OtpRequest {
    @NotBlank(message = "Mobile number is required")
    @Schema(example = "+919876543210")
    private String mobileNumber;

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
}
