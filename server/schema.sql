-- MySQL Schema for Learning Platform
-- Database: learning_platform (user-created)
-- Run: mysql -u root -p learning_platform < schema.sql

DROP TABLE IF EXISTS ml_predictions, learning_analytics, recommendations, chat_messages, study_sessions, learning_history, user_progress, topics, users;



CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE topics (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  total_subtopics INT DEFAULT 0,
  estimated_hours VARCHAR(50),
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced'),
  prerequisites JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
  topic_id VARCHAR(255),
  completed_subtopics JSON,
  current_subtopic VARCHAR(255),
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE learning_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  topic_id VARCHAR(255) NOT NULL,
  subtopic_id VARCHAR(255) NOT NULL,
  time_spent_minutes INT DEFAULT 0,
  completed_at TIMESTAMP NULL,
  difficulty_rating INT,
  understanding_level INT,
  attempts INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE study_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  topic_id VARCHAR(255) NOT NULL,
  duration_minutes INT,
  topic_completed BOOLEAN DEFAULT FALSE,
  performance_score INT,
  notes TEXT,
  session_date DATE DEFAULT CURDATE(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  topic_id VARCHAR(255) NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'general',
  helpful BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  recommended_topic_id VARCHAR(255) NOT NULL,
  recommended_subtopic_id VARCHAR(255),
  reason TEXT,
  confidence_score DECIMAL(3,2),
  priority INT DEFAULT 0,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

-- ML Predictions table
CREATE TABLE ml_predictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  prediction_type ENUM('next_topic', 'study_time', 'difficulty', 'performance') NOT NULL,
  predicted_topic_id VARCHAR(255),
  predicted_subtopic_id VARCHAR(255),
  predicted_value DECIMAL(10,4),
  confidence_score DECIMAL(5,4),
  model_version VARCHAR(50) DEFAULT 'v1',
  features_used JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Learning Analytics aggregated metrics
CREATE TABLE learning_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  metric_type ENUM('daily_progress', 'weekly_summary', 'topic_strength', 'study_pattern') NOT NULL,
  metric_date DATE NOT NULL,
  metric_value DECIMAL(10,4),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE KEY unique_daily_metric (student_id, metric_type, metric_date)
);

-- Indexes for performance
CREATE INDEX idx_learning_history_student ON learning_history(student_id);
CREATE INDEX idx_chat_messages_student ON chat_messages(student_id);
CREATE INDEX idx_recommendations_student ON recommendations(student_id);
CREATE INDEX idx_ml_predictions_student ON ml_predictions(student_id);
CREATE INDEX idx_learning_analytics_student ON learning_analytics(student_id);
CREATE INDEX idx_learning_analytics_date ON learning_analytics(metric_date);

-- Add roll_number column to users (migration)
ALTER TABLE users ADD COLUMN roll_number VARCHAR(50) UNIQUE AFTER name;

-- Sample students with roll numbers and roll numbers
INSERT INTO users (id, name, roll_number, email, avatar) VALUES 
('STU001', 'Alex Johnson', 'A001', 'alex@example.com', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'),
('STU002', 'Sarah Chen', 'S002', 'sarah@example.com', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'),
('STU003', 'Michael Rodriguez', 'M003', 'michael@example.com', 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'),
('STU004', 'Emma Thompson', 'E004', 'emma@example.com', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'),
('STU005', 'David Kim', 'D005', 'david@example.com', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop');

-- Sample progress data for ranking demo
INSERT INTO user_progress (user_id, topic_id, progress_percentage) VALUES 
('STU001', 'dsa-intro', 60),
('STU002', 'dsa-intro', 85),
('STU003', 'dsa-intro', 95),
('STU004', 'arrays', 40),
('STU005', 'arrays', 100),
('STU001', 'arrays', 20),
('STU002', 'arrays', 90),
('STU003', 'arrays', 100),
('STU005', 'dsa-intro', 75);

-- Original sample topics
INSERT INTO topics (id, title, category, difficulty) VALUES 
('dsa-intro', 'DSA Introduction', 'DSA', 'Beginner'),
('arrays', 'Arrays', 'DSA', 'Beginner');

