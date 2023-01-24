const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderControllers.js")
const auth = require("../auth")

router.post("/checkout", auth.verify, (req, res) => {
	const data = {
		order: req.body,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	}
	orderController.addOrder(data).then(resultFromController => res.send(resultFromController));
});

// Retrieves All Orders
router.get("/all", (req, res) => {
	orderController.getAllOrders().then(resultFromController => res.send(resultFromController));
});

module.exports = router;