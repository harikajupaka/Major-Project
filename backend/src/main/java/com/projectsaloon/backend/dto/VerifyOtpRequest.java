package com.projectsaloon.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {
    @NotBlank(message = "Mobile number is required")
    @Schema(example = "+919876543210")
    private String mobileNumber;

    @NotBlank(message = "OTP is required")
    @Schema(example = "123456")
    private String otp;

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
