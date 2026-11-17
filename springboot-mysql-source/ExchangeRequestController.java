package com.example.skillexchange.controller;

import com.example.skillexchange.model.ExchangeRequest;
import com.example.skillexchange.repository.ExchangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/requests")
public class ExchangeRequestController {

    @Autowired
    private ExchangeRequestRepository requestRepository;

    // Fetch requests where user is sender or receiver
    @GetMapping
    public ResponseEntity<List<ExchangeRequest>> getRequestsByUser(@RequestParam Long userId) {
        try {
            List<ExchangeRequest> requests = requestRepository.findBySenderIdOrReceiverId(userId, userId);
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Submit new skill exchange request
    @PostMapping
    public ResponseEntity<ExchangeRequest> submitRequest(@RequestBody ExchangeRequest request) {
        try {
            ExchangeRequest _req = requestRepository.save(new ExchangeRequest(
                request.getSenderId(),
                request.getReceiverId(),
                request.getSkillOfferedId(),
                request.getSkillOfferedName(),
                request.getSkillWantedId(),
                request.getSkillWantedName(),
                "pending"
            ));
            return new ResponseEntity<>(_req, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update request state (accept, reject, cancel)
    @PatchMapping("/{id}")
    public ResponseEntity<ExchangeRequest> updateRequestStatus(
            @PathVariable("id") long id,
            @RequestParam String status) {
        Optional<ExchangeRequest> requestData = requestRepository.findById(id);

        if (requestData.isPresent()) {
            ExchangeRequest _req = requestData.get();
            _req.setStatus(status);
            return new ResponseEntity<>(requestRepository.save(_req), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
