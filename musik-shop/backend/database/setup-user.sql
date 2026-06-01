-- Создание отдельного пользователя для приложения.
-- Пароль: см. db-credentials.txt в корне репозитория.
-- Выполнение: sudo mariadb < database/setup-user.sql

CREATE DATABASE IF NOT EXISTS musik_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE musik_shop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  recovery_keyword_hash VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(512),
  gallery JSON,
  category VARCHAR(50) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  badge VARCHAR(20),
  stock INT NOT NULL DEFAULT 0
);

CREATE USER IF NOT EXISTS 'musik'@'localhost' IDENTIFIED BY '5a94649cf0f89f0cd3f1f69f3e67056f9779490ed8f41305';
GRANT ALL PRIVILEGES ON musik_shop.* TO 'musik'@'localhost';
FLUSH PRIVILEGES;
