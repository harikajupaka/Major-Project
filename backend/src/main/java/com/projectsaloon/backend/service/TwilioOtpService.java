package com.projectsaloon.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioOtpService {
    private final String accountSid;
    private final String authToken;
    private final String verifyServiceSid;

    public TwilioOtpService(
            @Value("${twilio.account-sid:}") String accountSid,
            @Value("${twilio.auth-token:}") String authToken,
            @Value("${twilio.verify-service-sid:}") String verifyServiceSid) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.verifyServiceSid = verifyServiceSid;
    }

    public boolean isConfigured() {
        return !accountSid.isBlank() && !authToken.isBlank() && !verifyServiceSid.isBlank();
    }

    public void send(String mobileNumber) {
        Twilio.init(accountSid, authToken);
        Verification.creator(verifyServiceSid, mobileNumber, "sms").create();
    }

    public boolean verify(String mobileNumber, String otp) {
        Twilio.init(accountSid, authToken);
        return "approved".equalsIgnoreCase(
                VerificationCheck.creator(verifyServiceSid)
                        .setTo(mobileNumber)
                        .setCode(otp)
                        .create()
                        .getStatus());
    }
}