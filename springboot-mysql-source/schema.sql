-- ==========================================
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
);

-- 5. Session Bookings Table
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    type ENUM('online', 'offline') DEFAULT 'online',
    location_details VARCHAR(255),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    has_certificate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES exchange_requests(id) ON DELETE CASCADE
);

-- 6. Private Chat Threads
CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_chat_members (user1_id, user2_id)
);

-- 7. Chat Messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Ratings & Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. System Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    type ENUM('request', 'chat', 'session', 'system', 'review') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Dedicated Admins Table (For platform overseers)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Seed Data
INSERT INTO users (id, name, email, password, phone, bio, location, avatar, experience_level, role) VALUES
(1, 'Alice Smith', 'alice@example.com', 'password123', '+15550192834', 'Senior React engineer eager to practice Spanish conversation.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'Expert', 'user'),
(2, 'Roberto Gomez', 'roberto@example.com', 'password123', '+15550234567', 'Native Spanish speaker looking to learn Python coding.', 'Miami, FL', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'Expert', 'user'),
(3, 'System Admin', 'admin@example.com', 'admin', '+15000000000', 'Console Operations Overseer', 'Cloud Base', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 'Expert', 'admin');

INSERT INTO skills (id, name, category, description, level, user_id) VALUES
(1, 'Web Development', 'Technology & Coding', 'Build professional React websites', 'Expert', 1),
(2, 'Spanish Conversation', 'Languages', 'Daily practical vocabulary and accents', 'Expert', 2);

INSERT INTO user_skills (user_id, skill_name, association_type) VALUES
(1, 'Web Development', 'offered'),
(1, 'Spanish Conversation', 'wanted'),
(2, 'Spanish Conversation', 'offered'),
(2, 'Web Development', 'wanted');
