const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find(
        {
            deleted: false,
            status: "active"
        }
    ).sort({ position : "desc"});
    const newProducts = products.map((item) => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(2);
        return item;
    })
    res.render("client/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts
    })
}