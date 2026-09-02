package com.projectsaloon.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
@Tag(name = "Appointment Management", description = "Endpoints for scheduling appointments based on categories and stylists")
public class AppointmentController {

    @Operation(summary = "1. Select Category", description = "Step 1: Customer selects main category (Male/Female/Children) and sub-category (Hair care/Body care), creating an initial appointment document.")
    @PostMapping("/category")
    public String selectCategory(
            @RequestParam String customerId,
            @RequestParam String mainCategory,
            @RequestParam String subCategory) {
        // According to doc: stores customer id, main category, subcategory in 'appointment' collection
        return "Appointment initiated for Customer " + customerId + " with Main Category: " + mainCategory + ", Sub Category: " + subCategory;
    }

    @Operation(summary = "2. Select Stylist", description = "Step 2: Customer selects a stylist from the Stylist's Edge list.")
    @PutMapping("/{appointmentId}/stylist")
    public String selectStylist(
            @PathVariable String appointmentId,
            @RequestParam String stylistId) {
        // According to doc: fetches stylist_id and updates the appointment collection
        return "Appointment " + appointmentId + " updated with Stylist ID " + stylistId;
    }

    @Operation(summary = "3. Confirm Appointment", description = "Step 3: Customer enters Date and Time to confirm the booking in the Cart screen.")
    @PutMapping("/{appointmentId}/confirm")
    public String confirmAppointment(
            @PathVariable String appointmentId,
            @RequestParam String dateAndTime) {
        // According to doc: Confirming the appointment
        return "Appointment " + appointmentId + " confirmed for " + dateAndTime;
    }

    @Operation(summary = "Get Appointment Details", description = "Retrieves an appointment by its ID")
    @GetMapping("/{appointmentId}")
    public String getAppointment(@PathVariable String appointmentId) {
        return "Details for Appointment ID " + appointmentId;
    }
}
