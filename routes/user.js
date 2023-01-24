const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers.js")
const auth = require("../auth")

// Registration
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
})

// Login
router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
})

// Retrieves User Details
router.get("/userDetails/:userId", (req, res) => {
	userController.getUser(req.params).then(resultFromController => res.send(resultFromController));
})

module.exports = router;
