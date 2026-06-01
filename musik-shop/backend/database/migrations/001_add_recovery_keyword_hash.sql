-- Восстановление пароля по ключевому слову
USE musik_shop;

ALTER TABLE users
  ADD COLUMN recovery_keyword_hash VARCHAR(255) NULL AFTER password_hash;
