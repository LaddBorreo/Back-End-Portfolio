const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const userControllers = require("../controllers/userController");
const productControllers = require("../controllers/productController");
const auth = require("../auth.js");

// register user
router.post("/register", (req, res) => {
    userControllers.register(req.body).then((resultFromController) => {
        res.send(resultFromController);
    });
});

//Only Admin can access the users info
router.get("/", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        userControllers.getAllUsers(req.body).then((resultFromController) => {
            res.send(resultFromController);
        });
    } else {
        res.send("You are not allowed to access this page");
    }
});

// User Login
router.post("/login", (req, res) => {
    userControllers.loginUser(req.body).then((resultFromController) => {
        res.send(resultFromController);
    });
});

// Setting user as admin by only admin
router.put("/setAdmin", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin == true) {
        let userId = req.body.userId;

        userControllers.setAsAdmin({ userId }).then((resultFromController) => {
            res.send(resultFromController);
        });
    } else {
        res.send("You are not allowed to access this page");
    }
});

//

module.exports = router;
