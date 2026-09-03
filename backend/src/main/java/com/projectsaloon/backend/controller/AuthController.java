package com.projectsaloon.backend.controller;

import com.projectsaloon.backend.dto.ApiResponse;
import com.projectsaloon.backend.dto.LoginRequest;
import com.projectsaloon.backend.dto.LoginResponse;
import com.projectsaloon.backend.dto.OtpRequest;
import com.projectsaloon.backend.dto.OtpResponse;
import com.projectsaloon.backend.dto.RegisterRequest;
import com.projectsaloon.backend.dto.VerifyOtpRequest;
import com.projectsaloon.backend.model.Customer;
import com.projectsaloon.backend.service.TwilioOtpService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "User registration and login")
public class AuthController {

    // Simple in-memory database for users
    private static final Map<String, Customer> usersDb = new ConcurrentHashMap<>();
    private static final Map<String, OtpEntry> otpDb = new ConcurrentHashMap<>();
    private static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();
    private static final Random RANDOM = new Random();
    private final TwilioOtpService twilioOtpService;

    public AuthController(TwilioOtpService twilioOtpService) {
        this.twilioOtpService = twilioOtpService;
    }

    @Value("${jwt.secret:your_super_secret_jwt_key_saloon_which_must_be_long_enough}")
    private String jwtSecret;

    @Value("${otp.expose-code:false}")
    private boolean otpExposeCode;

    @Operation(summary = "Register Customer", description = "Registers a new customer with their details and password.")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        String mobileNumber = normalizeMobileNumber(request.getMobileNumber());
        if (usersDb.containsKey(mobileNumber)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "User already exists with this mobile number."));
        }

        Customer customer = new Customer(
            mobileNumber,
                PASSWORD_ENCODER.encode(request.getPassword()),
                request.getName(),
                request.getAge(),
                request.getGender()
        );
        usersDb.put(customer.getMobileNumber(), customer);

        return ResponseEntity.ok(new ApiResponse(true, "Registration successful. You can now login."));
    }

    @Operation(summary = "Login Customer", description = "Authenticates a customer and returns a JWT Bearer token.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Customer customer = usersDb.get(normalizeMobileNumber(request.getMobileNumber()));

        if (customer == null || !PASSWORD_ENCODER.matches(request.getPassword(), customer.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Invalid mobile number or password."));
        }

        // Generate JWT 
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        String token = Jwts.builder()
                .setSubject(customer.getMobileNumber())
                .claim("name", customer.getName())
                .claim("mobileNumber", customer.getMobileNumber())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return ResponseEntity.ok(new LoginResponse(
                true, 
                "Login successful", 
                token, 
                "Bearer", 
                customer.getName(), 
                customer.getMobileNumber()
        ));
    }

    @Operation(summary = "Send OTP", description = "Creates a one-time password for a registered customer.")
    @PostMapping("/otp/send")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody OtpRequest request) {
        String mobileNumber = normalizeMobileNumber(request.getMobileNumber());
        if (!usersDb.containsKey(mobileNumber)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new OtpResponse(false, "No account exists with this mobile number."));
        }

        if (twilioOtpService.isConfigured()) {
            try {
                twilioOtpService.send(mobileNumber);
                return ResponseEntity.ok(new OtpResponse(true, "OTP sent successfully."));
            } catch (RuntimeException exception) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(new OtpResponse(false, "The OTP provider could not send a code."));
            }
        }

        String otp = String.format("%06d", RANDOM.nextInt(1_000_000));
        otpDb.put(mobileNumber, new OtpEntry(otp, System.currentTimeMillis() + 300_000));
        return ResponseEntity.ok(otpExposeCode
                ? new OtpResponse(true, "OTP sent successfully.", otp)
                : new OtpResponse(true, "OTP sent successfully."));
    }

    @Operation(summary = "Verify OTP", description = "Verifies the most recently issued OTP.")
    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String mobileNumber = normalizeMobileNumber(request.getMobileNumber());
        if (twilioOtpService.isConfigured()) {
            try {
                if (twilioOtpService.verify(mobileNumber, request.getOtp())) {
                    return ResponseEntity.ok(new ApiResponse(true, "OTP verified successfully."));
                }
            } catch (RuntimeException exception) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(new ApiResponse(false, "The OTP provider could not verify the code."));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid or expired OTP."));
        }

        OtpEntry otpEntry = otpDb.get(mobileNumber);
        if (otpEntry == null || otpEntry.expiresAt() < System.currentTimeMillis()
            || !otpEntry.code().equals(request.getOtp())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid or expired OTP."));
        }

        otpDb.remove(mobileNumber);
        return ResponseEntity.ok(new ApiResponse(true, "OTP verified successfully."));
    }

    private String normalizeMobileNumber(String mobileNumber) {
        String trimmed = mobileNumber.trim();
        if (trimmed.matches("\\d{10}")) {
            return "+91" + trimmed;
        }
        return trimmed;
    }

    private record OtpEntry(String code, long expiresAt) {}
}
