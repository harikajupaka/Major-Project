package com.projectsaloon.backend.model;

import java.util.UUID;

public class Appointment {
    private String id;
    private String customerId; // mobileNumber
    private String mainCategory;
    private String subCategory;
    private String stylistId;
    private String dateAndTime;
    private String status; // INITIATED, STYLIST_SELECTED, CONFIRMED
    private String servicesJson;
    
    public Appointment() {
        this.id = UUID.randomUUID().toString();
        this.status = "INITIATED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getMainCategory() { return mainCategory; }
    public void setMainCategory(String mainCategory) { this.mainCategory = mainCategory; }
    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    public String getStylistId() { return stylistId; }
    public void setStylistId(String stylistId) { this.stylistId = stylistId; }
    public String getDateAndTime() { return dateAndTime; }
    public void setDateAndTime(String dateAndTime) { this.dateAndTime = dateAndTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getServicesJson() { return servicesJson; }
    public void setServicesJson(String servicesJson) { this.servicesJson = servicesJson; }
}
