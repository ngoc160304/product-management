const ProductCategory = require("../models/products-category.model");
module.exports.getSubCategory = async (parentId) => {
    const getSubCategory = async (parentId) => {
        let listSub = [];
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false
        })
        listSub = [...subs];
        for(const sub of subs) {
            const childs = await getSubCategory(sub.id);
            listSub = listSub.concat(childs);
        }
        return listSub;
    }
    const result = await getSubCategory(parentId);
    return result;
}