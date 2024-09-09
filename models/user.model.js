const mongoose = require("mongoose");
const token = require("../helpers/generate")
const schema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    address: String,
    tokenUser: {
        type: String,
        default: token.generateString(20)
    },
    phone: String,
    avatar: String,
    status: {
        type: String,
        default: "accept"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        default: "man"
    },
    otp: {
        forget_password: String,
        update_password: String
    }
}, {
    timestamps: true
});
const User = mongoose.model('User', schema, 'users');

module.exports = User;