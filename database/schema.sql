-- ============================================================
--  Notepad App - MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS notepad_db;
USE notepad_db;


CREATE TABLE IF NOT EXISTS notes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL DEFAULT 'Untitled Note',
    content     TEXT,
    category    VARCHAR(100)  DEFAULT 'General',
    color       VARCHAR(20)   DEFAULT '#ffffff',
    is_pinned   TINYINT(1)    DEFAULT 0,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample notes to get started
INSERT INTO notes (title, content, category, color, is_pinned) VALUES
('Welcome to NoteVault 📝', 'Hello! This is your personal notepad.\n\n✅ Create notes\n✅ Edit & delete\n✅ Pin important notes\n✅ Categorize & color-code\n\nStart by clicking "New Note"!', 'General', '#fef9c3', 1),
('Shopping List 🛒', 'Milk\nEggs\nBread\nButter\nApples', 'Personal', '#dcfce7', 0),
('Project Ideas 💡', 'Build a 3-tier web app\nLearn FastAPI\nPractice MySQL joins', 'Work', '#dbeafe', 0);

