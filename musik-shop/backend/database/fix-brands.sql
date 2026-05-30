USE musik_shop;

UPDATE products SET brand = 'Fender®' WHERE brand = 'Fenter®' OR name LIKE '%Fender%';
