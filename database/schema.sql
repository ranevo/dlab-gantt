CREATE DATABASE IF NOT EXISTS dlab_gantt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dlab_gantt;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  alias VARCHAR(100) NOT NULL,
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('pending', 'active', 'disabled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_permissions (
  user_id INT PRIMARY KEY,
  can_read TINYINT(1) NOT NULL DEFAULT 1,
  can_write TINYINT(1) NOT NULL DEFAULT 0,
  can_delete TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_user_permissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  action ENUM('login', 'register') NOT NULL,
  success TINYINT(1) NOT NULL,
  message TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS statuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tree_nodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NULL,
  level ENUM('project', 'major', 'medium', 'task') NOT NULL,
  name VARCHAR(255) NOT NULL,
  status_id INT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  sort_order INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tree_nodes_parent FOREIGN KEY (parent_id) REFERENCES tree_nodes(id) ON DELETE CASCADE,
  CONSTRAINT fk_tree_nodes_status FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS node_assignees (
  node_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (node_id, user_id),
  CONSTRAINT fk_node_assignees_node FOREIGN KEY (node_id) REFERENCES tree_nodes(id) ON DELETE CASCADE,
  CONSTRAINT fk_node_assignees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS memos (
  node_id INT PRIMARY KEY,
  content LONGTEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_memos_node FOREIGN KEY (node_id) REFERENCES tree_nodes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  node_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  accomplished TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expected_end_date DATE NULL,
  status VARCHAR(50) NOT NULL DEFAULT '예정',
  CONSTRAINT fk_todos_node FOREIGN KEY (node_id) REFERENCES tree_nodes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  node_id INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_files_node FOREIGN KEY (node_id) REFERENCES tree_nodes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` TEXT NOT NULL
) ENGINE=InnoDB;

INSERT INTO statuses (name, color) VALUES
  ('진행', '#3182ce'),
  ('완료', '#38a169'),
  ('예정', '#805ad5'),
  ('중단', '#e53e3e'),
  ('위험', '#dd6b20'),
  ('문제', '#d69e2e')
ON DUPLICATE KEY UPDATE name = VALUES(name), color = VALUES(color);

INSERT INTO settings (`key`, `value`) VALUES
  ('session_timeout_minutes', '10'),
  ('highlight_color', '#3182ce'),
  ('memo_font_size', '14'),
  ('attachment_root', 'C:/dlab-gantt/attachments')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

