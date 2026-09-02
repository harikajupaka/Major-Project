package com.projectsaloon.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {
    @NotBlank(message = "Mobile number is required")
    @Schema(example = "+919876543210")
    private String mobileNumber;

    @NotBlank(message = "Password is required")
    @Schema(example = "password123")
    private String password;

    @NotBlank(message = "Name is required")
    @Schema(example = "John Doe")
    private String name;

    @NotNull(message = "Age is required")
    @Schema(example = "25")
    private Integer age;

    @NotBlank(message = "Gender is required")
    @Schema(example = "Male")
    private String gender;

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
