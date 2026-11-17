package com.example.skillexchange.controller;

import com.example.skillexchange.model.Skill;
import com.example.skillexchange.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    // Get all skills with search / filtering criteria
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {
        try {
            List<Skill> skills;
            if (q != null && category != null) {
                skills = skillRepository.findByNameContainingAndCategory(q, category);
            } else if (q != null) {
                skills = skillRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
            } else if (category != null) {
                skills = skillRepository.findByCategory(category);
            } else {
                skills = skillRepository.findAll();
            }
            return new ResponseEntity<>(skills, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add new skill
    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        try {
            Skill _skill = skillRepository.save(new Skill(
                skill.getName(), 
                skill.getCategory(), 
                skill.getDescription(), 
                skill.getLevel(), 
                skill.getUserId(),
                skill.getUserName()
            ));
            return new ResponseEntity<>(_skill, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update skill
    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable("id") long id, @RequestBody Skill skill) {
        Optional<Skill> skillData = skillRepository.findById(id);

        if (skillData.isPresent()) {
            Skill _skill = skillData.get();
            _skill.setName(skill.getName());
            _skill.setCategory(skill.getCategory());
            _skill.setDescription(skill.getDescription());
            _skill.setLevel(skill.getLevel());
            return new ResponseEntity<>(skillRepository.save(_skill), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete skill
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSkill(@PathVariable("id") long id) {
        try {
            skillRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
