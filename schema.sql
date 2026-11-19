CREATE DATABASE IF NOT EXISTS marketplace;
USE marketplace;


DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sellers;

CREATE TABLE sellers (
    seller_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20)
) ENGINE = INNODB;

CREATE TABLE categories (
    category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
) ENGINE = INNODB;

CREATE TABLE listings (
    listing_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_sold BOOLEAN NOT NULL DEFAULT FALSE,
    listed_on DATE NOT NULL,
    seller_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_listings_sellers
        FOREIGN KEY (seller_id) REFERENCES sellers(seller_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_listings_categories
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT
) ENGINE = INNODB;
