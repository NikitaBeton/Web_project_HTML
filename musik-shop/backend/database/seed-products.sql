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

-- Обновление существующей БД (если таблица уже создана)
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery JSON NULL AFTER image_url;

DELETE FROM products;

INSERT INTO products (id, name, description, price, image_url, gallery, category, brand, badge, stock) VALUES
(1, 'Акустическая гитара Martin 000-15m',
 'Компактная акустическая гитара серии 000 с корпусом из красного дерева и верхней декой из Sitka spruce. Тёплый сбалансированный звук для домашних занятий и студии.',
 4890.00,
 '/images/products/martin-000-15m/martin-000-15m-xl.webp',
 '["/images/products/martin-000-15m/martin-000-15m-xl.webp","/images/products/martin-000-15m/martin-000-15m-00-xl.jpg","/images/products/martin-000-15m/martin-000-15m-01-xl.jpg","/images/products/martin-000-15m/martin-000-15m-02-xl.jpg"]',
 'Гитары', 'Martin®', 'Хит', 7),
(2, 'Электрогитара Fender Mustang',
 'Легендарная короткомензурная электрогитара с двумя single-coil звукоснимателями. Универсальный инструмент для инди, панка и экспериментальной музыки.',
 3290.00,
 '/images/products/mustang/fender-mustang-electric-guitar(2)-xl.webp',
 '["/images/products/mustang/fender-mustang-electric-guitar(2)-xl.webp","/images/products/mustang/fender-mustang-electric-guitar-00-xl.jpg","/images/products/mustang/fender-mustang-electric-guitar-01-xl.jpg"]',
 'Гитары', 'Fender®', 'Акция', 9),
(3, 'Педаль Boss DS-2 Turbo Distortion',
 'Двухрежимная педаль дисторшна: режим I — классический DS-1, режим II — Turbo с усиленной атакой. Надёжный стальной корпус Boss.',
 890.00,
 '/images/products/boss-ds-2/boss-ds-2-turbo-distortion-xl.webp',
 '["/images/products/boss-ds-2/boss-ds-2-turbo-distortion-xl.webp","/images/products/boss-ds-2/boss-ds-2-turbo-distortion-00-xl.jpg","/images/products/boss-ds-2/boss-ds-2-turbo-distortion-01-xl.jpg"]',
 'Эффекты', 'Boss®', 'Новинка', 14),
(4, 'Бас-гитара Fender Precision',
 'Бас Precision с характерным «телецастым» звуком. Мощный низ, чёткий атакующий верх — основа рок- и поп-групп.',
 4190.00,
 '/images/products/fender-precision-bass/fender-precision-bass-xl.webp',
 '["/images/products/fender-precision-bass/fender-precision-bass-xl.webp","/images/products/fender-precision-bass/fender-precision-bass-00-xl.jpg","/images/products/fender-precision-bass/fender-precision-bass-02-xl.jpg"]',
 'Бас-гитары', 'Fender®', NULL, 5);
