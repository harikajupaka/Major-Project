package com.projectsaloon.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OtpResponse {
    private boolean success;
    private String message;
    private String debugCode;

    public OtpResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public OtpResponse(boolean success, String message, String debugCode) {
        this(success, message);
        this.debugCode = debugCode;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getDebugCode() { return debugCode; }
}
