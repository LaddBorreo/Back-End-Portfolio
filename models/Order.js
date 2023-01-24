const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		default: [true, "User Id is required!"]
	},
	productId: {
			type: String,
			default: [true, "Product Id is required!"]
	},
	quantity: {
			type: Number,
			default: [true, "Quantity is required!"]
	},
	totalAmount: {
		type: Number
	},
	purchasedOnDate: {
		type: Date,
		default: new Date()
	}
})

module.exports = mongoose.model("Order", orderSchema);