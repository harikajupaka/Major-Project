package com.projectsaloon.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customer Management", description = "Endpoints for customer login and operations")
public class CustomerController {



    @Operation(summary = "Get Customer Details", description = "Retrieves customer information by ID.")
    @GetMapping("/{id}")
    public String getCustomer(@PathVariable String id) {
        return "Customer details for ID " + id;
    }

    @Operation(summary = "Register Customer", description = "Registers a new customer with Name, Age, Gender, and links to their mobile number after OTP verification.")
    @PostMapping("/register")
    public String registerCustomer(
            @RequestParam String mobile,
            @RequestParam String name,
            @RequestParam Integer age,
            @RequestParam String gender) {
        // In a real implementation, this would save the details to the 'customer' collection in Firestore
        return "Customer " + name + " successfully registered with mobile " + mobile;
    }
}
