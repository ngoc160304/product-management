const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const { Schema } = mongoose;
const schema = new Schema({
    title: String,
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
})

const productsCategory = mongoose.model('ProductsCategory', schema, 'products-category');

module.exports = productsCategory;