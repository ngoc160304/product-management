const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    user_id: String,
    cartId: String,
    consignee_info: {
        fullname: String,
        phone: String,
        address: String
    },
    products: [
        {
            quantity: Number,
            product_id: String,
        }
    ],
    payment_info: {
        amount: Number,
        purchase_date: String,
        bank_code: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Order = mongoose.model('Order', schema, 'orders');

module.exports = Order;
