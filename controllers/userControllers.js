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

// Get User Details
module.exports.getUser = (reqParams) => {
	console.log(reqParams)
	return User.findById(reqParams.userId).then(result => {
		result.password = "";
		return result;
	});
}