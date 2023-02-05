const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const userControllers = require("../controllers/userController");
const productControllers = require("../controllers/productController");
const auth = require("../auth.js");

// Adding a product by the admin
router.post("/addProduct", auth.verify, (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
        products: req.body,
    };

    productControllers.addProduct(data).then((resultFromController) => {
        res.send(resultFromController);
    });
});

// show all products by anyone
router.get("/", (req, res) => {
    productControllers.showAll(req.body).then((resultFromController) => {
        res.send(resultFromController);
    });
});

// Retrieve as single product
router.get("/specificProduct", (req, res) => {
    let productId = req.body.productId;

    productControllers
        .showOneProduct({ productId })
        .then((resultFromController) => {
            res.send(resultFromController);
        });
});

// Update product by admin only
router.put("/updateProduct/:productId", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        let data = {
            Id: req.params.productId,
            updatedData: req.body,
        };

        productControllers.updateProduct(data).then((resultFromController) => {
            res.send(resultFromController);
        });
    } else {
        res.send("You are not allowed to update a product");
    }
});

// Archive active product (only Admin)
router.put("/archive/:productId", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization).isAdmin;

    if (userData) {
        let productId = req.params.productId;
        productControllers
            .archiveProduct(productId)
            .then((resultFromController) => {
                res.send(resultFromController);
            });
    } else {
        res.send("You are not allowed to archive a product");
    }
});

// Exports all Routers
module.exports = router;
