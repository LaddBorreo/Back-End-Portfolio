const Order = require("../models/Order");
const Product = require("../models/Product");

module.exports.addOrder = (data) => {
	if (data.isAdmin===false) {
		let newOrder = new Order({
			userId : data.order.userId,
			productId: data.order.productId,
			quantity: data.order.quantity,
			totalAmount: data.order.quantity * 2
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