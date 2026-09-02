package com.projectsaloon.backend.controller;

import com.projectsaloon.backend.dto.ApiResponse;
import com.projectsaloon.backend.dto.LoginRequest;
import com.projectsaloon.backend.dto.LoginResponse;
import com.projectsaloon.backend.dto.RegisterRequest;
import com.projectsaloon.backend.model.Customer;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "User registration and login")
public class AuthController {

    // Simple in-memory database for users
    private static final Map<String, Customer> usersDb = new ConcurrentHashMap<>();

    @Value("${jwt.secret:your_super_secret_jwt_key_saloon_which_must_be_long_enough}")
    private String jwtSecret;

    @Operation(summary = "Register Customer", description = "Registers a new customer with their details and password.")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (usersDb.containsKey(request.getMobileNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "User already exists with this mobile number."));
        }

        Customer customer = new Customer(
                request.getMobileNumber(),
                request.getPassword(), // In production, Hash this!
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
        Customer customer = usersDb.get(request.getMobileNumber());

        if (customer == null || !customer.getPassword().equals(request.getPassword())) {
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
}
