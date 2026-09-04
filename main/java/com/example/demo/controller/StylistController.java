package com.example.demo.controller;

import com.example.demo.model.Rating;
import com.example.demo.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/stylist")
@CrossOrigin(origins = "*")
public class StylistController {

    @Autowired
    private RatingRepository ratingRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getStylists() {
        List<Map<String, Object>> stylists = new ArrayList<>();

        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "STYL01");
        s1.put("name", "Alex Riva");
        s1.put("specialization", "Hair Styling & Coloring");
        s1.put("rating", 4.8);
        s1.put("experience", "5 Years");

        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "STYL02");
        s2.put("name", "Jordan Lee");
        s2.put("specialization", "Beard Grooming & Skincare");
        s2.put("rating", 4.6);
        s2.put("experience", "3 Years");

        stylists.add(s1);
        stylists.add(s2);

        return ResponseEntity.ok(stylists);
    }

    @PostMapping("/rating/submit")
    public ResponseEntity<?> submitRating(@RequestBody Rating rating) {
        Map<String, String> response = new HashMap<>();

        if (rating.getRatingValue() == null || rating.getReviewText() == null || rating.getReviewText().trim().isEmpty()) {
            response.put("error", "E002");
            response.put("message", "You should select the rating and write review before submitting");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        ratingRepository.save(rating);

        response.put("message", "MSG03: You have provided rating and review successfully to stylist");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}