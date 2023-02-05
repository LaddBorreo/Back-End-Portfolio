// Modules
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");

const app = express();
// Routes

// Database Connection
mongoose.connect(
    "mongodb+srv://admin:admin1234@cluster0.bx7hhb5.mongodb.net/Capstone2?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
// Setting notifications if the database is connected
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.on("open", () => console.log("We are now connected to the database"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/orders/cart", cartRoutes);

// Middlewares for routes

// Server listening
app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now connected on port: ${process.env.PORT}`);
});
