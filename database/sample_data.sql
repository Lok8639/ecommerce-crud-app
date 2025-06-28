USE ecommerce_db;

INSERT INTO categories (category_name, description) VALUES
('Electronics', 'Electronic gadgets and appliances'),
('Books', 'Various kinds of books'),
('Clothing', 'Men and Women clothing');

INSERT INTO products (product_name, category_id, price, stock) VALUES
('Smartphone', 1, 25000.00, 20),
('Laptop', 1, 60000.00, 10),
('Novel', 2, 500.00, 50),
('T-shirt', 3, 300.00, 100);
