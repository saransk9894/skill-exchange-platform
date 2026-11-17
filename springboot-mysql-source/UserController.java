package com.example.skillexchange.controller;

import com.example.skillexchange.model.User;
import com.example.skillexchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // User registration
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }

        User newUser = new User(
            user.getName(),
            user.getEmail(),
            user.getPassword(), // In a real production application, use BCryptPasswordEncoder
            user.getPhone(),
            user.getBio(),
            user.getLocation(),
            user.getExperienceLevel()
        );

        userRepository.save(newUser);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    // User login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> dbUser = userRepository.findByEmail(user.getEmail());

        if (dbUser.isPresent() && dbUser.get().getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(dbUser.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid email or password!");
        }
    }

    // Forgot Password Mock
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        Optional<User> dbUser = userRepository.findByEmail(email);
        if (dbUser.isPresent()) {
            return ResponseEntity.ok("Password recovery link has been dispatched to: " + email);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Email address not recognized.");
        }
    }
}
