const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../auth.js");

// Create a new order

router.post("/placeOrder/", auth.verify, (req, res) => {
    let data = {
        userData: auth.decode(req.headers.authorization).username,
        order: req.body,
    };

    orderController.placeOrder(data).then((resultFromTheController) => {
        res.send(resultFromTheController);
    });
});

// Retrieve the all orders from the users
router.get("/", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    orderController.checkAllOrders(userData).then((resultFromTheController) => {
        res.send(resultFromTheController);
    });
});

// Check orders for authenticated user (admin only)
router.get("/userOrders", auth.verify, (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
        userId: req.body.userId,
    };

    orderController
        .checkOrderFromAUser(data)
        .then((resultFromTheController) => {
            res.send(resultFromTheController);
        });
});

// Exports all Routers
module.exports = router;
