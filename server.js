require("dotenv").config(); // MUST be at top

const express = require("express");
const app = express();

const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const Products = require("./model/products.models");
const productsRouter = require("./routes/admin/products.router");

// ================== MIDDLEWARE ==================

app.use(expressLayouts);

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
  })
);

// ================== DATABASE CONNECTION ==================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// ================== ROUTES ==================

app.use(productsRouter);

app.get("/", (req, res) => {
  res.render("pages/Main_Site_pages/landingPage");
});

app.get("/:Category", async (req, res) => {
  try {
    let products = await Products.find({
      categoryid: req.params.Category,
    });

    res.render("pages/Main_Site_pages/categorypages", {
      product: products,
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).send("Error loading products");
  }
});

// ================== SERVER ==================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
