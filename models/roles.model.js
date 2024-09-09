const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const schema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
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
const Roles = mongoose.model('Roles', schema, 'roles');

module.exports = Roles;