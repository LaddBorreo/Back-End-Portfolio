// modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Local modules
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const auth = require("../auth");

//Register a user
module.exports.register = (reqBody) => {
    let user = new User({
        username: reqBody.username,
        email: reqBody.email,
        password: bcrypt.hashSync(reqBody.password, 10),
    });
    // Looking if the username already exists
    return User.findOne({ username: user.username })
        .then((result) => {
            if (result != null) {
                return false;
            } else {
                return user.save().then((result, error) => {
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
                return "Successfully Registered";
            } else {
                return "Failed to Register. Username already exists";
            }
        });
};

// Retrieve all users
module.exports.getAllUsers = (result, error) => {
    return User.find(result).then((result) => {
        result.forEach((user) => {
            user.password = "********";
        });
        return result;
    });
};

// Login registered users
module.exports.loginUser = (reqBody) => {
    return User.findOne({ username: reqBody.username }).then((result) => {
        if (result == null) {
            return false;
        } else {
            const isPasswordCorrect = bcrypt.compareSync(
                reqBody.password,
                result.password
            );
            if (isPasswordCorrect) {
                return { access: auth.createAccessToken(result) };
            } else {
                return "Wrong Password";
            }
        }
    });
};

// Set user as admin by an admin only
module.exports.setAsAdmin = (data) => {
    return User.findById(data.userId)
        .then((result) => {
            if (result.isAdmin) {
                return false;
            } else {
                result.isAdmin = true;
                return result.save().then((user, error) => {
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
                return "Admin access granted";
            } else {
                return "Admin access denied";
            }
        });
};
