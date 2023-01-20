const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required!"]
	},
	password: {
		type: String,
		required: [true, "Password is required!"]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	orders: [{
		products: {
			productName: String,
			quantity: Number
		},
		totalAmount: Number,
		purchasedOnDate: {
			type: Date,
			default: new Date()
		}	
	}]
})

module.exports = mongoose.model("User", userSchema);