const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    otp: String,
    email: String,
    expireAt: {
        type: Date,
        expires: 60*5,
    }
});
const ForgetPassword = mongoose.model('ForgetPassword', schema, 'forget-password');
module.exports = ForgetPassword;

