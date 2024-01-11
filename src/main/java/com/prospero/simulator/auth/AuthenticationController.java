package com.prospero.simulator.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be empty");
        }
        if (request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be empty");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        if (request.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long");
        }
        AuthenticationResponse response = service.register(request);
        if (response == null) {
            return ResponseEntity.badRequest().body("User with this email already exists");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("authenticate")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        if (request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be empty");
        }
        if (request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be empty");
        }
        AuthenticationResponse response = service.authenticate(request);
        if (response == null) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
        return ResponseEntity.ok(response);
    }
}
