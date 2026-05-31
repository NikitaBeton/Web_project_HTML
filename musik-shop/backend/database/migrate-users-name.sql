-- Переименование username → name (если таблица создана по старой схеме).
USE musik_shop;

ALTER TABLE users
  CHANGE COLUMN username name VARCHAR(100) NOT NULL UNIQUE;
