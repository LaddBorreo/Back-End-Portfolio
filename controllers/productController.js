// modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Local modules
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const auth = require("../auth");

// Adding a product by the Admin
module.exports.addProduct = async (data) => {
    if (data.isAdmin) {
        let product = new Product({
            name: data.products.name,
            description: data.products.description,
            price: data.products.price,
        });

        // Looking if the product name already exists
        return Product.findOne({ name: product.name })
            .then((result) => {
                if (result != null) {
                    return false;
                } else {
                    return product.save().then((result, error) => {
                        if (error) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                }
            })
            .then((result) => {
                if (result) {
                    return "Successfully added product";
                } else {
                    return "Failed to add product. Product already exists";
                }
            });
    } else {
        return "You are not allowed to access this page";
    }
};

// Show all the products
module.exports.showAll = (data) => {
    return Product.find({ isActive: true }).then((product, error) => {
        if (error) {
            return false;
        } else {
            return product;
        }
    });
};

// Show specific product via ID
module.exports.showOneProduct = (product) => {
    return Product.findById(product.productId).then((product, error) => {
        if (error) {
            return false;
        } else {
            return product;
        }
    });
};

// Update product only by the admin
module.exports.updateProduct = (data) => {
    // searching product via given id
    return Product.findById(data.Id)
        .then((product, error) => {
            if (error) {
                return false;
            }
            // updating product details
            else {
                product.name = data.updatedData.name;
                product.description = data.updatedData.description;
                product.price = data.updatedData.price;

                return product.save().then((save, error) => {
                    if (error) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        })
        .then((product) => {
            if (product) {
                return "Successfully updated";
            } else {
                return "Failed to update";
            }
        });
};

// Archive a product via id (only Admin)
module.exports.archiveProduct = async (archiveProduct) => {
    return Product.findById(archiveProduct)
        .then((product, errror) => {
            // check if the product is already not active
            if (product.isActive) {
                // setting the product as not active
                product.isActive = false;
                // saving the product status
                return product.save().then((save, error) => {
                    if (save) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                return false;
            }
        })
        .then((product) => {
            if (product) {
                return "Successfully archived product";
            } else {
                return "Failed to archive product";
            }
        });
};
