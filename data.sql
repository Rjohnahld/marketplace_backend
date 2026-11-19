USE marketplace;

INSERT INTO categories (name) VALUES
    ('Electronics'),
    ('Furniture'),
    ('Clothing'),
    ('Books'),
    ('Sports');

INSERT INTO sellers (name, email, phone) VALUES
    ('Alice Tan', 'alice@example.com', '91234567'),
    ('Ben Lim', 'ben@example.com', '98765432'),
    ('Chloe Ng', 'chloe@example.com', NULL);

INSERT INTO listings (title, description, price, is_sold, listed_on, seller_id, category_id) VALUES
    ('iPhone 13 128GB', 'Used for 2 years, battery health 85%. Comes with case.', 450.00, FALSE, '2026-11-01', 1, 1),
    ('Logitech MX Master 3 mouse', 'Works perfectly, minor scratches.', 60.00, FALSE, '2026-11-03', 2, 1),
    ('Nintendo Switch OLED', 'Barely used, full box.', 320.00, TRUE, '2026-10-20', 3, 1),
    ('IKEA study desk', 'White, 120x60cm. Self collect only.', 40.00, FALSE, '2026-11-05', 1, 2),
    ('Office chair', 'Mesh back, adjustable height.', 55.00, FALSE, '2026-11-08', 2, 2),
    ('Uniqlo down jacket (M)', 'Worn once on a winter trip.', 35.00, FALSE, '2026-11-10', 3, 3),
    ('Nike running shoes (US 9)', 'Used for about 100km.', 45.00, TRUE, '2026-10-28', 1, 3),
    ('Clean Code by Robert Martin', 'Paperback, some highlighting.', 20.00, FALSE, '2026-11-12', 2, 4),
    ('Harry Potter box set', 'All 7 books, good condition.', 50.00, FALSE, '2026-11-14', 3, 4),
    ('Adjustable dumbbells (2 x 20kg)', 'Selling because moving house.', 120.00, FALSE, '2026-11-15', 1, 5),
    ('Badminton racket', 'Yonex, restrung last month.', 30.00, FALSE, '2026-11-16', 2, 5);
