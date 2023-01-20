const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product Name is Required!"]
	},
	description : {
		type: String,
		required: [true, "Description is required!"]
	},
	price: {
		type: Number,
		required: [true, "Price is required"]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOnDate: {
		type: Date,
		default: new Date()
	},
	orders: {
		orderId : String
		}
})

module.exports = mongoose.model("Product", productSchema);