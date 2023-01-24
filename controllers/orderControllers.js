const Order = require("../models/Order");
const Product = require("../models/Product");

module.exports.addOrder = (data) => {
	if (data.isAdmin === false) {
		let newOrder = new Order({
			userId : data.order.userId,
			productId: data.order.productId,
			price: data.order.price,
			quantity: data.order.quantity,
			totalAmount: data.order.quantity * data.order.price
		});
		return newOrder.save().then((order, error) => {
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


// Retrieves All Orders
module.exports.getAllOrders = () => {
		return Order.find({}).then(result => {
			return result;
		});
}