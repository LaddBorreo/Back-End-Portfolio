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
router.get("/details", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization)
	userControllers.getProfile({userId: req.body.id}).then(resultFromController => res.send(resultFromController));
})

//Enroll
router.post("/order", auth.verify, (req, res) => {
	let data = {
		userId: auth.decode(req.headers.authorization).id,
		productName: req.body.productName,
		quantity: req.body.quantity
	}
	userControllers.order(data).then(resultFromController => res.send(resultFromController));
})

module.exports = router;