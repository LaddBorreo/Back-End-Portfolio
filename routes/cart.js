const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../auth.js");

// adding items to the users cart
router.post("/addToCart", auth.verify, (req, res) => {
    const data = {
        userData: auth.decode(req.headers.authorization),
        order: req.body,
    };

    cartController.addToCartOrder(data).then((resultFromTheControler) => {
        res.send(resultFromTheControler);
    });
});

// checking the users cart
router.get("/yourCart", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    cartController.checkCartItems(userData).then((resultFromTheControler) => {
        res.send(resultFromTheControler);
    });
});

// updating users cart
router.patch("/updateYourCart/:cartIdItem", auth.verify, (req, res) => {
    const userData = {
        user: auth.decode(req.headers.authorization),
        cartUpdate: req.body,
        itemToBeUpdate: req.params.cartIdItem,
    };
    cartController
        .updatingCartItems(userData)
        .then((resultFromTheControler) => {
            res.send(resultFromTheControler);
        });
});

// Deleting cart item
router.delete("/deleteCartItem/:cartIdItem", auth.verify, (req, res) => {
    const userData = {
        user: auth.decode(req.headers.authorization),
        confirmation: req.body.isDeleteItem,
        itemToBeDelete: req.params.cartIdItem,
    };
    cartController.deleteCartItem(userData).then((resultFromTheControler) => {
        res.send(resultFromTheControler);
    });
});

// Check out Cart Items
router.post("/checkOutCartItems/", auth.verify, (req, res) => {
    let data = {
        userData: auth.decode(req.headers.authorization).usename,
        confirmation: req.body.isCheckOutCart,
    };

    cartController.checkOutCartItems(data).then((resultFromTheController) => {
        res.send(resultFromTheController);
    });
});

// Exports all Routers
module.exports = router;
