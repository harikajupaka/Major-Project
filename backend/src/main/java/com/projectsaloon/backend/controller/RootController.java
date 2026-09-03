package com.projectsaloon.backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {
    @GetMapping("/")
    public Map<String, String> status() {
        return Map.of(
                "service", "Project Saloon Backend",
                "status", "running",
                "frontend", "http://localhost:5173"
        );
    }
}
