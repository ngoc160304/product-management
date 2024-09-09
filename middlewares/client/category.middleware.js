const ProductCategory = require("../../models/products-category.model");
module.exports.getCategory = async (req, res, next) => {
    const categorys = await ProductCategory.find({
        deleted: false,
        status: "active",
        parent_id: ""
    })
    res.locals.categorys = categorys;
    next();
}