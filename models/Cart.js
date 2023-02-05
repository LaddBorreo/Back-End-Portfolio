const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: String,
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            subTotal: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("Cart", cartSchema);
