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

app.get("/", async function (req, res, next) {
    res.render("index")
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});