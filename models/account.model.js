const mongoose = require("mongoose");
const token = require("../helpers/generate")
const schema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: token.generateString(10)
    },
    phone: String,
    role_id: String,
    avatar: String,
    status: String,
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
const Account = mongoose.model('Account', schema, 'accounts');

module.exports = Account;