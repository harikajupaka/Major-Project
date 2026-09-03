package com.projectsaloon.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {
    @GetMapping({"/", "/register", "/verify-otp", "/home", "/subcategories",
            "/stylists", "/stylist-profile", "/cart", "/feedback"})
    public String frontend() {
        return "forward:/index.html";
    }
}
