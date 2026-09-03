package com.projectsaloon.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private String tokenType;
    private String name;
    private String mobileNumber;

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LoginResponse(boolean success, String message, String token, String tokenType, String name, String mobileNumber) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.tokenType = tokenType;
        this.name = name;
        this.mobileNumber = mobileNumber;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public String getName() { return name; }
    public String getMobileNumber() { return mobileNumber; }
}
