// modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Local modules
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// adding order to cart
module.exports.addToCartOrder = (data) => {
    // check if the user is registered
    return User.findById(data.userData.id)
        .then((result, error) => {
            if (result == null || result.isAdmin) {
                return false;
            } else {
                // Finding the product name is existing
                return Product.findOne({
                    name: data.order.products,
                }).then((productResult, error) => {
                    if (productResult == null) {
                        return false;
                    } else {
                        // checking if the product is active
                        if (productResult.isActive) {
                            let cart = new Cart({
                                userId: result.id,
                                userName: result.username,
                                products: [
                                    {
                                        productId: productResult.id,
                                        productName: data.order.products,
                                        quantity: data.order.quantity,
                                        price: productResult.price,
                                        subTotal:
                                            data.order.quantity *
                                            productResult.price,
                                    },
                                ],
                            });
                            // this will check if the userId already have  a cart
                            return Cart.findOne({
                                userId: cart.userId,
                            }).then((result) => {
                                if (result != null) {
                                    // If username already exists, it will push is new cart items
                                    let newCartItem = {
                                        productId: productResult.id,
                                        productName: data.order.products,
                                        quantity: data.order.quantity,
                                        price: productResult.price,
                                        subTotal:
                                            data.order.quantity *
                                            productResult.price,
                                    };
                                    result.products.push(newCartItem);
                                    result.save();

                                    return true;
                                } else {
                                    // if they don't have yet, this will make a new one
                                    return cart.save().then((save, error) => {
                                        if (error) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    });
                                }
                            });
                        } else {
                            return false;
                        }
                    }
                });
            }
        })
        .then((result) => {
            if (result) {
                return "Successfull add to cart!";
            } else {
                return "Failed to add to Item.   Check if: 1. You are not an admin. 2. Item is unavailable";
            }
        });
};

// Check all cart items based on the current logged in user
module.exports.checkCartItems = (data) => {
    return Cart.findOne({ userId: data.id }).then((result, error) => {
        if (result) {
            // Setting an empty array to store subtotals
            let totalCartAmount = [];
            // pushing subtotals of each cart product items
            result.products.forEach((product) => {
                totalCartAmount.push(product.subTotal);
            });
            // Showing the All cart items and Total Amount
            return (
                result +
                `totalAmount: ${totalCartAmount.reduce(
                    (newValue, oldValue) => newValue + oldValue
                )}`
            );
        } else {
            return "You don't have any cart items";
        }
    });
};

// Updating cart items
module.exports.updatingCartItems = (data) => {
    // finding cart items via user id
    return Cart.findOne({ userId: data.user.id })
        .then((result, error) => {
            if (result == null) {
                return false;
            } else {
                // setting a variable for the products on cart of the user
                let allCartItems = result.products;
                // filtering item if it is exist
                let ifCartItemExist = allCartItems.filter((product) => {
                    return product.id === data.itemToBeUpdate;
                });
                // check if the cart item exists
                if (ifCartItemExist.length > 0) {
                    // Getting the index number of the cart item
                    let cartItemIndex = allCartItems.findIndex((element) => {
                        return element.id === data.itemToBeUpdate;
                    });

                    // updating cart items values
                    result.products[cartItemIndex].quantity =
                        data.cartUpdate.quantity;
                    result.products[cartItemIndex].subTotal =
                        data.cartUpdate.quantity *
                        result.products[cartItemIndex].price;

                    // saving updated values
                    return result.save().then((save, error) => {
                        if (save) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            }
        })
        .then((result) => {
            if (result) {
                return "Cart successfully updated";
            } else {
                return "Failed to update. Check if you have existing cart items";
            }
        });
};

// Delete cart item
module.exports.deleteCartItem = (data) => {
    // finding cart items via user id
    return Cart.findOne({ userId: data.user.id })
        .then((result, error) => {
            if (result == null) {
                return false;
            } else {
                if (data.confirmation) {
                    // setting a variable for the products on cart of the user
                    let allCartItems = result.products;
                    // filtering item if it is exist
                    let ifCartItemExist = allCartItems.filter((product) => {
                        return product.id === data.itemToBeDelete;
                    });
                    // checking if the cartItem data exist
                    if (ifCartItemExist.length > 0) {
                        // Getting the index number of the cart item
                        let cartItemIndex = allCartItems.findIndex(
                            (element) => {
                                return element.id === data.itemToBeDelete;
                            }
                        );
                        // deleting cart item on specified index
                        allCartItems.splice(cartItemIndex, 1);
                        // save the update
                        return result.save().then((save, error) => {
                            if (save) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                    }
                } else {
                    return false;
                }
            }
        })
        .then((result, error) => {
            if (result) {
                return "Cart Item successfully deleted";
            } else {
                console.log("Make sure you have a valid cart item");
                return "Cart item failed to delete.";
            }
        });
};

// checkout order and add to the list of orders
module.exports.checkOutCartItems = (data) => {
    // finding pending cart items via username
    return Cart.findOne({ username: data.userData })
        .then((resultFromCart, error) => {
            // if user does not exist or it is an admin
            if (resultFromCart == null || resultFromCart.IsAdmin) {
                return false;
            }
            // If user exist
            else {
                let totalCartAmount = [];
                // Pushing all subtotals to an empty array
                resultFromCart.products.forEach((product) => {
                    totalCartAmount.push(product.subTotal);
                });
                // creating new order based on the cart items
                let requestOrder = new Order({
                    userId: resultFromCart.id,
                    username: resultFromCart.userName,
                    products: resultFromCart.products,
                    totalAmount: totalCartAmount.reduce(
                        (newValue, oldValue) => newValue + oldValue
                    ),
                });
                // saving new order
                return requestOrder
                    .save()
                    .then((result, error) => {
                        if (result) {
                            // deleting cart items after checking out
                            return Cart.findOneAndDelete({
                                username: data.userData,
                            }).then((result, error) => {
                                if (result) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        } else {
                            return false;
                        }
                    })
                    .then((result) => {
                        return true;
                    });
            }
        })
        .then((result, error) => {
            if (result) {
                console.log(result);
                return "Succesfully checkout order!";
            } else {
                return "Failed to checkout order!";
            }
        });
};
