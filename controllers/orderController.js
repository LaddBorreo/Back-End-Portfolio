// modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Local modules
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../auth");

// Place order (only log user)
module.exports.placeOrder = (data) => {
    return User.findOne({ username: data.userData })
        .then((result, error) => {
            if (result == null || result.IsAdmin) {
                return false;
            } else {
                // checking if the product entered is available/valid
                return Product.findOne({
                    name: data.order.products,
                }).then((productResult, error) => {
                    if (productResult == null) {
                        return false;
                    } else {
                        if (productResult.isActive) {
                            let requestOrder = new Order({
                                userId: result.id,
                                username: result.username,
                                products: {
                                    productId: productResult.id,
                                    productName: productResult.name,
                                    quantity: data.order.quantity,
                                    price: productResult.price,
                                    subTotal:
                                        data.order.quantity *
                                        productResult.price,
                                },
                                totalAmount:
                                    data.order.quantity * productResult.price,
                            });
                            // if the product is available, order will be save
                            if (productResult) {
                                return requestOrder
                                    .save()
                                    .then((result, error) => {
                                        if (error) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    })
                                    .then((result) => {
                                        return true;
                                    });
                            }
                            // if the product is unavailable/not valid
                            else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                });
            }
        })
        .then((result) => {
            // Response to the user
            if (result) {
                return "Successfully Place order!";
            } else {
                return "Failed to place order. Order unavailable.";
            }
        });
};

// Check all orders  (admin only)
module.exports.checkAllOrders = async (data) => {
    // Check if the log user is admin
    if (data.isAdmin) {
        // finding the orders
        return Order.find().then((result, error) => {
            if (result) {
                return result;
            } else {
                return false;
            }
        });
    } else {
        return "You are not allowed access this";
    }
};

// Check orders for authenticated users (admin only)
module.exports.checkOrderFromAUser = async (data) => {
    if (data.isAdmin) {
        return Order.find({ userId: data.userId }).then((result, error) => {
            if (result.length < 0) {
                return "User not found";
            } else {
                return result;
            }
        });
    } else {
        return "You are not allowed access this";
    }
};
