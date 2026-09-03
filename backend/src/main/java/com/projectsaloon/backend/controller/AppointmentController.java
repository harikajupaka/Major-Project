package com.projectsaloon.backend.controller;

import com.projectsaloon.backend.model.Appointment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
@Tag(name = "Appointment Management", description = "Endpoints for scheduling appointments based on categories and stylists")
public class AppointmentController {

    private static final Map<String, Appointment> appointmentDb = new ConcurrentHashMap<>();

    @Operation(summary = "1. Select Category", description = "Step 1: Customer selects main category (Male/Female/Children) and sub-category, creating an initial appointment document.")
    @PostMapping("/category")
    public ResponseEntity<Appointment> selectCategory(
            HttpServletRequest request,
            @RequestParam(required = false) String customerId,
            @RequestParam String mainCategory,
            @RequestParam(required = false) String subCategory) {
        
        String mobileNumber = (String) request.getAttribute("authenticatedMobileNumber");
        if (mobileNumber == null) mobileNumber = customerId; // fallback
        
        Appointment appointment = new Appointment();
        appointment.setCustomerId(mobileNumber);
        appointment.setMainCategory(mainCategory);
        appointment.setSubCategory(subCategory != null ? subCategory : "General");
        
        appointmentDb.put(appointment.getId(), appointment);
        return ResponseEntity.ok(appointment);
    }

    @Operation(summary = "2. Select Stylist", description = "Step 2: Customer selects a stylist.")
    @PutMapping("/{appointmentId}/stylist")
    public ResponseEntity<Appointment> selectStylist(
            HttpServletRequest request,
            @PathVariable String appointmentId,
            @RequestParam String stylistId) {
            
        Appointment appointment = appointmentDb.get(appointmentId);
        if (appointment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        String mobileNumber = (String) request.getAttribute("authenticatedMobileNumber");
        if (mobileNumber != null && !mobileNumber.equals(appointment.getCustomerId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        appointment.setStylistId(stylistId);
        appointment.setStatus("STYLIST_SELECTED");
        return ResponseEntity.ok(appointment);
    }

    @Operation(summary = "3. Confirm Appointment", description = "Step 3: Customer enters Date and Time to confirm the booking.")
    @PutMapping("/{appointmentId}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(
            HttpServletRequest request,
            @PathVariable String appointmentId,
            @RequestParam String dateAndTime,
            @RequestParam(required = false) String servicesJson) {
            
        Appointment appointment = appointmentDb.get(appointmentId);
        if (appointment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        String mobileNumber = (String) request.getAttribute("authenticatedMobileNumber");
        if (mobileNumber != null && !mobileNumber.equals(appointment.getCustomerId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        appointment.setDateAndTime(dateAndTime);
        appointment.setServicesJson(servicesJson);
        appointment.setStatus("CONFIRMED");
        return ResponseEntity.ok(appointment);
    }

    @Operation(summary = "Get Appointment Details", description = "Retrieves an appointment by its ID")
    @GetMapping("/{appointmentId}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable String appointmentId) {
        Appointment appointment = appointmentDb.get(appointmentId);
        if (appointment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(appointment);
    }
    
    @Operation(summary = "Get My Bookings", description = "Retrieves all bookings for the logged-in user")
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Appointment>> getMyBookings(HttpServletRequest request) {
        String mobileNumber = (String) request.getAttribute("authenticatedMobileNumber");
        if (mobileNumber == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<Appointment> myBookings = appointmentDb.values().stream()
                .filter(app -> mobileNumber.equals(app.getCustomerId()) && "CONFIRMED".equals(app.getStatus()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(myBookings);
    }
}
