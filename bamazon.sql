DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE stuff(
    id INT NOT NULL AUTO_INCREMENT,
    bids VARCHAR(255),
    items VARCHAR(255),
    PRIMARY KEY(id)
);