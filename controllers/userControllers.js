const User = require("../models/User.js");
const Product = require("../models/Product.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");

// Registration
module.exports.registerUser = (reqBody) => {
	let newUser = new User({
		email: reqBody.email,
		password: bcrypt.hashSync(reqBody.password, 10)
	})
	return newUser.save().then((user, error) => {
		if(error){
			return false;
		}else{
			return user;
		}
	})
}

// Authentication
module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if(result == null){
			return false;
		}else{
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

			if(isPasswordCorrect){
				return {access: auth.createAccessToken(result)}
			}else{
				return false;
			}
		}
	})
}

// Get Profile
module.exports.getProfile = (data) => {
	console.log(data)
	return User.findById(data.userId).then(result => {
		console.log(result);
		result.password = "";
		return result;
	});
}

// Order
module.exports.order = async(data) => {
	let isUserUpdated = await User.findById(data.userId).then(user => {
		user.orders.push({productId: data.productId});
		return user.save().then((user, error) => {
			if(error){
				return false;	
			} else {
				return true;
			};
		});
	});
	let isProductUpdated = await Product.findById(data.productId).then(product => {
		product.enrollees.push({userId: data.userId});
		return product.save().then((product, error) => {	
			if(error){
				return false
			} else {
				return true
			};
		});
	});
	if(isUserUpdated && isProductUpdated){
		return true;
	} else {
		return false;
	};
}