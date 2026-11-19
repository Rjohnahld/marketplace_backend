const express = require("express");
const mysql2 = require("mysql2/promise");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout", "layout");
app.locals.pageTitle = "Listings";
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true
};

const dbConnection = mysql2.createPool(dbConfig);

// LISTINGS PORTION

app.get("/", async function (req, res, next) {
    try {
        const search = (req.query.search || "").trim();
        const categoryId = req.query.category_id || "";
        const maxPrice = req.query.max_price || "";

        // Base query: JOIN to show the seller's and category's names instead of their ids
        let sql = `SELECT listings.listing_id, listings.title, listings.price,
            listings.is_sold, listings.listed_on,
            sellers.name AS seller, categories.name AS category
            FROM listings
            JOIN sellers ON listings.seller_id = sellers.seller_id
            JOIN categories ON listings.category_id = categories.category_id
            WHERE 1 = 1`;
        const bindings = [];

        // Add a condition only for each filter the user actually filled in
        if (search) {
            sql += " AND listings.title LIKE ?";
            bindings.push(`%${search}%`);
        }
        if (categoryId) {
            sql += " AND listings.category_id = ?";
            bindings.push(categoryId);
        }
        if (maxPrice) {
            sql += " AND listings.price <= ?";
            bindings.push(maxPrice);
        }
        sql += " ORDER BY listings.listed_on DESC";

        const [listings] = await dbConnection.execute(sql, bindings);

        // For the category dropdown in the search form
        const [categories] = await dbConnection.execute("SELECT * FROM categories ORDER BY name");

        res.render("index", {
            pageTitle: "Listings",
            listings,
            categories,
            search,
            categoryId,
            maxPrice
        });
    } catch (e) {
        next(e);
    }
});

app.get("/listing/create", async function (req, res, next) {
    try {
        const [sellers] = await dbConnection.execute("SELECT * FROM sellers ORDER BY name");
        const [categories] = await dbConnection.execute("SELECT * FROM categories ORDER BY name");
        const today = new Date().toISOString().slice(0, 10);

        res.render("create-listing", {
            pageTitle: "Add Listing",
            listing: { listed_on: today },
            sellers,
            categories
        });
    } catch (e) {
        next(e);
    }
});

app.post("/listing/create", async function (req, res, next) {
    try {
        const { title, description, price, listed_on, seller_id, category_id } = req.body;
        const is_sold = req.body.is_sold ? 1 : 0;

        const sql = `INSERT INTO listings
            (title, description, price, is_sold, listed_on, seller_id, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await dbConnection.execute(sql, [
            title, description || null, price, is_sold, listed_on, seller_id, category_id
        ]);

        res.redirect("/");
    } catch (e) {
        next(e);
    }
});

app.get("/listing/:id/edit", async function (req, res, next) {
    try {
        const [rows] = await dbConnection.execute(
            "SELECT * FROM listings WHERE listing_id = ?", [req.params.id]);
        const listing = rows[0];

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        const [sellers] = await dbConnection.execute("SELECT * FROM sellers ORDER BY name");
        const [categories] = await dbConnection.execute("SELECT * FROM categories ORDER BY name");

        res.render("edit-listing", {
            pageTitle: "Edit Listing",
            listing,
            sellers,
            categories
        });
    } catch (e) {
        next(e);
    }
});

app.post("/listing/:id/edit", async function (req, res, next) {
    try {
        const { title, description, price, listed_on, seller_id, category_id } = req.body;
        const is_sold = req.body.is_sold ? 1 : 0;

        const sql = `UPDATE listings SET
            title = ?,
            description = ?,
            price = ?,
            is_sold = ?,
            listed_on = ?,
            seller_id = ?,
            category_id = ?
            WHERE listing_id = ?`;
        await dbConnection.execute(sql, [
            title, description || null, price, is_sold, listed_on,
            seller_id, category_id, req.params.id
        ]);

        res.redirect("/");
    } catch (e) {
        next(e);
    }
});

app.get("/listing/:id/delete", async function (req, res, next) {
    try {
        const [rows] = await dbConnection.execute(
            `SELECT listings.listing_id, listings.title, listings.price,
                sellers.name AS seller
             FROM listings
             JOIN sellers ON listings.seller_id = sellers.seller_id
             WHERE listings.listing_id = ?`, [req.params.id]);
        const listing = rows[0];

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("delete-listing", { pageTitle: "Delete Listing", listing });
    } catch (e) {
        next(e);
    }
});

app.post("/listing/:id/delete", async function (req, res, next) {
    try {
        await dbConnection.execute(
            "DELETE FROM listings WHERE listing_id = ?", [req.params.id]);
        res.redirect("/");
    } catch (e) {
        next(e);
    }
});

// CATEGORIES PORTION

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});