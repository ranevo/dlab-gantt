CREATE DATABASE IF NOT EXISTS dlab_gantt
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dlab_gantt;

DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('planned', 'in-progress', 'done') NOT NULL DEFAULT 'planned',
  parent_id INT NULL,
  CONSTRAINT fk_projects_parent
    FOREIGN KEY (parent_id) REFERENCES projects(id)
    ON DELETE CASCADE
);

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  due_date DATE NOT NULL,
  priority ENUM('높음', '중간', '낮음') DEFAULT '중간',
  completed TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_todos_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE
);
