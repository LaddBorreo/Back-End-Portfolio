const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const auth = require("../auth")

// Create Product
router.post("/", auth.verify, (req, res) => {
	const data = {
		product: req.body,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	}
	productController.addProduct(data).then(resultFromController => res.send(resultFromController));
});

// Retrieves All Product
router.get("/all", (req, res) => {
	productController.getAllProduct().then(resultFromController => res.send(resultFromController));
});

// Retrieves All Active Products
router.get("/", (req, res) => {
	productController.getAllActive().then(resultFromController => res.send(resultFromController));
})

// Retrieves Single Product
router.get("/:productId", (req, res) => {

	productController.getProduct(req.params).then(resultFromController => res.send(resultFromController));
})

// Updates a Product
router.put("/:productId", auth.verify, (req, res) => {

	productController.updateProduct(req.params, req.body).then(resultFromController => res.send(resultFromController));
})

// Archives Product
router.put("/archive/:productId", auth.verify, (req, res) => {
	const data = {
		reqParams: req.params,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	}
	productController.archiveProduct(data).then(resultFromController => res.send(resultFromController));	
});

module.exports = router;