import React, { useState } from 'react';
import { 
  Database, 
  Code, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  HelpCircle,
  FolderTree,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface CodeCenterViewProps {
  darkMode: boolean;
}

export default function CodeCenterView({ darkMode }: CodeCenterViewProps) {
  const [activeTab, setActiveTab] = useState<'minimal' | 'mysql' | 'java_user' | 'java_skill' | 'java_request' | 'readme'>('minimal');
  const [copied, setCopied] = useState(false);

  const minimalCode = `// server.js - Smallest Full Skill Exchange (No DB to Initiate)
// Run with: node server.js
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const FILE = './db.json';
const getDB = () => fs.existsSync(FILE) 
  ? JSON.parse(fs.readFileSync(FILE, 'utf-8')) 
  : { users: [], skills: [], requests: [] };
const saveDB = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// 1. Get all skills
app.get('/api/skills', (req, res) => {
  res.json(getDB().skills);
});

// 2. Post a new skill
app.post('/api/skills', (req, res) => {
  const db = getDB();
  const skill = { id: Date.now(), ...req.body };
  db.skills.push(skill);
  saveDB(db);
  res.status(201).json(skill);
});

// 3. Simple Login / Register (Auto-saves user)
app.post('/api/auth/login', (req, res) => {
  const db = getDB();
  let user = db.users.find(u => u.email === req.body.email);
  if (!user) {
    user = { id: Date.now(), name: req.body.name || 'User', email: req.body.email };
    db.users.push(user);
    saveDB(db);
  }
  res.json(user);
});

// 4. Create exchange request
app.post('/api/requests', (req, res) => {
  const db = getDB();
  const request = { id: Date.now(), status: 'pending', ...req.body };
  db.requests.push(request);
  saveDB(db);
  res.status(201).json(request);
});

// 5. Get user exchange requests
app.get('/api/requests', (req, res) => {
  const { userId } = req.query;
  const requests = getDB().requests.filter(
    r => String(r.senderId) === String(userId) || String(r.receiverId) === String(userId)
  );
  res.json(requests);
});

app.listen(3000, () => console.log('Server running on port 3000'));`;

  const mysqlSchema = `-- ==========================================
-- Skill Exchange System - MySQL Database Schema
-- Generated for peer-to-peer barter education.
-- ==========================================

CREATE DATABASE IF NOT EXISTS skill_exchange_db;
USE skill_exchange_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    location VARCHAR(150),
    avatar VARCHAR(255),
    experience_level ENUM('Beginner', 'Intermediate', 'Expert') DEFAULT 'Beginner',
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Skills Catalog Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    level ENUM('Beginner', 'Intermediate', 'Expert') NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Junction Table for Users Skills (Wanted Skills)
CREATE TABLE IF NOT EXISTS user_skills (
    user_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    association_type ENUM('offered', 'wanted') NOT NULL,
    PRIMARY KEY (user_id, skill_name, association_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Exchange Requests Table
CREATE TABLE IF NOT EXISTS exchange_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    skill_offered_id INT NOT NULL,
    skill_wanted_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_offered_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_wanted_id) REFERENCES skills(id) ON DELETE CASCADE
);`;

  const javaUserController = `package com.example.skillexchange.controller;

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
            user.getPassword(), // Standard plain-string in dev. Hash in prod!
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid credentials!");
        }
    }
}`;

  const javaSkillController = `package com.example.skillexchange.controller;

import com.example.skillexchange.model.Skill;
import com.example.skillexchange.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {
        try {
            List<Skill> skills;
            if (q != null) {
                skills = skillRepository.findByNameContainingIgnoreCase(q);
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
}`;

  const javaRequestController = `package com.example.skillexchange.controller;

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

    @GetMapping
    public ResponseEntity<List<ExchangeRequest>> getRequestsByUser(@RequestParam Long userId) {
        try {
            List<ExchangeRequest> requests = requestRepository.findBySenderIdOrReceiverId(userId, userId);
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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
}`;

  const readmeInstructions = `# Spring Boot & MySQL Platform Installation Guide

### Prerequisites
- JDK 17+ installed on computer
- Apache Maven 3.6+
- MySQL Server 8.0+ running locally

### Database Bootstrap
1. Connect to MySQL command prompt or Workbench:
   \`mysql -u root -p\`
2. Run database initialization script:
   \`CREATE DATABASE skill_exchange_db;\`
   \`USE skill_exchange_db;\`
   (Execute schema.sql queries to construct all tables)

### Configuring application.properties
Configure datasource details in \`src/main/resources/application.properties\`:
\`\`\`properties
spring.datasource.url=jdbc:mysql://localhost:3306/skill_exchange_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
\`\`\`

### Compile and Start Server
\`\`\`bash
mvn clean install
mvn spring-boot:run
\`\`\`
The services will initialize on port 8080!`;

  const getCodeContent = () => {
    switch (activeTab) {
      case 'minimal': return minimalCode;
      case 'mysql': return mysqlSchema;
      case 'java_user': return javaUserController;
      case 'java_skill': return javaSkillController;
      case 'java_request': return javaRequestController;
      case 'readme': return readmeInstructions;
      default: return '';
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-6 text-xs text-left" id="code-center-container">
      
      {/* Intro header */}
      <div className="border-b pb-4 dark:border-slate-900 space-y-1">
        <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2.5 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          <Terminal className="h-5 w-5 text-emerald-500" />
          <span>Code Center & Architecture</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Select between lightweight zero-initiation code, MySQL schemas, or full Spring Boot controllers.
        </p>
      </div>

      {/* Directory structure visual representation */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row gap-6 items-start md:items-center ${
        darkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-50/60 border-slate-200/60 shadow-2xs'
      }`}>
        <div className="text-left space-y-1.5 max-w-sm shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-500 flex items-center gap-1.5 tracking-wider">
            <FolderTree className="h-3.5 w-3.5" />
            <span>Project Folder Layout</span>
          </span>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Clean, Modular Skill Exchange Architecture</p>
          <p className="text-[10px] text-slate-400 leading-normal">Zero external database dependencies needed — works instantly with standard Node.js/Express or optional backend.</p>
        </div>
        <div className="flex-1 font-mono text-[10px] text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-900 w-full overflow-x-auto select-none">
          <p className="text-emerald-400 font-bold">⚡ Zero-DB-Setup Smallest App:</p>
          <p className="pl-4">├── 📄 server.js (35 lines, reads/writes db.json directly)</p>
          <p className="pl-4">└── 📄 db.json (Automatic JSON file store, no database server needed)</p>
        </div>
      </div>

      {/* Code Viewer Layout Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side File Tabs Selector */}
        <div className="lg:w-1/4 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('minimal')}
            className={`w-full p-3.5 rounded-xl text-left font-bold transition-all flex items-center justify-between border cursor-pointer ${
              activeTab === 'minimal'
                ? 'bg-emerald-600/10 text-emerald-600 border-emerald-500/30 ring-1 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/50 dark:border-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Code className="h-4 w-4 text-emerald-500" />
              <span>Smallest Code (Zero DB)</span>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full">Fast</span>
          </button>

          <button
            onClick={() => setActiveTab('mysql')}
            className={`w-full p-3.5 rounded-xl text-left font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
              activeTab === 'mysql'
                ? 'bg-emerald-600/10 text-emerald-600 border-emerald-500/20'
                : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/50 dark:border-slate-900'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>schema.sql (MySQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('java_user')}
            className={`w-full p-3.5 rounded-xl text-left font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
              activeTab === 'java_user'
                ? 'bg-emerald-600/10 text-emerald-600 border-emerald-500/20'
                : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/50 dark:border-slate-900'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>UserController.java</span>
          </button>

          <button
            onClick={() => setActiveTab('java_skill')}
            className={`w-full p-3.5 rounded-xl text-left font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
              activeTab === 'java_skill'
                ? 'bg-emerald-600/10 text-emerald-600 border-emerald-500/20'
                : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/50 dark:border-slate-900'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>SkillController.java</span>
          </button>

          <button
            onClick={() => setActiveTab('java_request')}
            className={`w-full p-3.5 rounded-xl text-left font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
              activeTab === 'java_request'
                ? 'bg-emerald-600/10 text-emerald-600 border-emerald-500/20'
                : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/50 dark:border-slate-900'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>ExchangeController.java</span>
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`w-full p-3.5 rounded-xl text-left font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
              activeTab === 'readme'
                ? 'bg-emerald-600/10 text-emerald-600 border-emerald-500/20'
                : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/50 dark:border-slate-900'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Setup & Installation</span>
          </button>
        </div>

        {/* Right Side Mono Editor Canvas */}
        <div className="lg:w-3/4 flex flex-col rounded-2xl overflow-hidden border border-slate-900 bg-[#070b12] text-slate-300 relative shadow-md">
          
          {/* Action header bar */}
          <div className="bg-slate-950 p-3 px-4 flex justify-between items-center border-b border-slate-900">
            <span className="font-mono text-[10px] text-slate-500">
              {activeTab === 'minimal' ? 'server.js (Zero DB Setup)' : activeTab === 'mysql' ? 'schema.sql' : activeTab === 'readme' ? 'README.md' : `${activeTab}.java`}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition active:scale-95 cursor-pointer border border-slate-800"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Pre-formatted source listing */}
          <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto max-h-[450px] text-left select-text scrollbar-thin scrollbar-thumb-slate-800">
            <pre className="whitespace-pre">{getCodeContent()}</pre>
          </div>

        </div>

      </div>

    </div>
  );
}
