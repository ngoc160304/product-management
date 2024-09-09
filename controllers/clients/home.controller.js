const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [GET] /
module.exports.index = async (req, res) => {
    // product feature
    const productFeature = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(4).sort({position: "desc"})
    const newProductsFeature = productHelper.productsPriceNew(productFeature);
    // product new
    const productsNew = await Product.find({
        deleted: false,
        status: "active",
    }).sort({position: "desc"}).limit(12);
    const newProductsNew = productHelper.productsPriceNew(productsNew);
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeature: newProductsFeature,
        productsNew: newProductsNew
    })
}