const Product = require("../models/Product");

// Creates Product
module.exports.addProduct = (data) => {
	if (data.isAdmin) {
		let newProduct = new Product({
			name : data.product.name,
			description : data.product.description,
			price : data.product.price
		});
		return newProduct.save().then((product, error) => {
			if (error) {
				return false;
			} else {
				return true;
			};
		});
	} else {
		return false;
	};
};

// Retrieves All Product
module.exports.getAllProducts = () => {
	return Product.find({}).then(result => {
		return result;
	});
}

// Retrieves All Active Product
module.exports.getAllActive = () => {
	return Product.find({isActive : true}).then(result => {
		return result;
	});
}

// Retrieves Single Product
module.exports.getProduct = (reqParams) => {
	console.log(reqParams)
	return Product.findById(reqParams.productId).then(result => {
		return result;
	});
}

// Updates Product
module.exports.updateProduct = (reqParams, reqBody) => {
	let updatedProduct = {
		name : reqBody.name,
		description: reqBody.description,
		price: reqBody.price
	};
	return Product.findByIdAndUpdate(reqParams.productId, updatedProduct).then((product, error) => {
		if(error){
			return false;
		} else {
			return true;
		}
	})
}

// Deletes Product
module.exports.archiveProduct = (data) => {
if(data.isAdmin === true){
		let updateActiveField = {
			isActive : false
		};
		return Product.findByIdAndUpdate(data.reqParams.productId, updateActiveField).then((product, error) => {
			if (error) {
				return false;
			} else {
				return true;
			}
		});
	} else {
		return false
	}
};
