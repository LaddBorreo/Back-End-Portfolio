const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");
const app = express();

mongoose.connect("mongodb+srv://admin:admin1234@cluster0.bx7hhb5.mongodb.net/CAPSTONE2?retryWrites=true&w=majority",{
	useNewUrlParser : true,
	useUnifiedTopology: true
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("We're connected to the cloud database."));

// MiddleWares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);


app.listen(process.env.PORT || 4000, () => {
	console.log(`API is now online on port ${process.env.PORT || 4000}`)
});