package com.projectsaloon.backend.model;

public class Customer {
    private String mobileNumber;
    private String password;
    private String name;
    private int age;
    private String gender;

    public Customer(String mobileNumber, String password, String name, int age, String gender) {
        this.mobileNumber = mobileNumber;
        this.password = password;
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
