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
		productName: {
			type: String,
			required: [true, "Product is required!"]
		},
		quantity: {
			type: Number,
			required: [true, "Quantity is required!"]
		},
		purchasedOnDate: {
			type: Date,
			default: new Date()
		}	
	}]
})

module.exports = mongoose.model("User", userSchema);
////