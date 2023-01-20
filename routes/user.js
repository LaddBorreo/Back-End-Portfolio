const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers.js")
const auth = require("../auth")

// Registration
router.post("/register", (req, res) => {
	userControllers.registerUser(req.body).then(resultFromController => res.send(resultFromController));
})

// Login
router.post("/login", (req, res) => {
	userControllers.loginUser(req.body).then(resultFromController => res.send(resultFromController));
})

// Retrieves User Details
router.post("/details", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization)
	userControllers.getProfile({userId: req.body.id}).then(resultFromController => res.send(resultFromController));
})

// Order
router.post("/enroll", auth.verify, (req, res) => {
	let data = {
		userId: auth.decode(req.headers.authorization).id,
		productId: req.body.productId
	}
	userControllers.enroll(data).then(resultFromController => res.send(resultFromController));
})

module.exports = router;