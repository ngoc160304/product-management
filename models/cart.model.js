const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    user_id: String,
    products: [
        {
            product_id: String,
            quantity: Number,
            selected: {
                type: Boolean,
                default: false
            },
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Cart = mongoose.model('Cart', schema, 'cart');

module.exports = Cart;