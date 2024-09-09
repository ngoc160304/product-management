const Product = require("../../models/product.model");
const ProductCategory = require("../../models/products-category.model");
const Cart = require("../../models/cart.model");
const productCategoryHelper = require("../../helpers/product-category");
const productHelper = require("../../helpers/product");
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find(
        {
            deleted: false,
            status: "active"
        }
    ).sort({ position: "desc" });
    const newProducts = productHelper.productsPriceNew(products)
    res.render("client/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts
    })
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    console.log(req.params.slugCategory);
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })
    if (category) {
        const categoryChilds = await ProductCategory.find({
            parent_id: category.id,
            deleted: false,
            status: "active"
        })
        let newCategory = [];
        for (let i = 0; i < categoryChilds.length; i++) {
            const categoryChild = await ProductCategory.find({
                parent_id: categoryChilds[i].id
            });
            if (categoryChild) {
                categoryChilds[i].children = [...categoryChild];
                newCategory.push(categoryChilds[i]);
            }
        }
        if (!newCategory.length) {
            newCategory = [...categoryChilds];
        }

        const subCategory = await productCategoryHelper.getSubCategory(category.id);
        const subCategoryId = subCategory.map(item => item.id);
        const products = await Product.find({
            category_id: {
                $in: [category.id, ...subCategoryId],
            },
            status: "active",
            deleted: false
        })
        const newProducts = productHelper.productsPriceNew(products);
        res.render("client/pages/product/index", {
            pageTitle: category.title,
            products: [],
            categorysChild: newCategory,
            products: newProducts
        })
    } else {
        res.redirect("/user/login")
    }
}

// [GET] /products/detail/:slugTitle
module.exports.detail = async (req, res) => {
    const product = await Product.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugTitle
    })
    const newProduct = productHelper.productPriceNew(product);
    res.render("client/pages/product/detail", {
        pageTitle: product.title,
        product: newProduct
    })
}

// [POST] /products/buy-now/:productId
module.exports.buyNow = async (req, res) => {
    const user = res.locals.infoUser;
    if (user) {
        const productId = req.params.productId;
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({
            _id: cartId
        })
        const productExist = cart.products.find((product) => product.product_id === productId);
        if (!productExist) {
            await Cart.updateOne(
                {
                    _id: cartId
                },
                {
                    $push: {
                        products: {
                            product_id: productId,
                            quantity: 1
                        }
                    }
                }
            )
        } else {
            await Cart.updateOne(
                {
                    _id: cartId,
                    'products.product_id': productId
                },
                {
                    $set: {
                        "products.$.quantity": productExist.quantity + 1
                    }
                }
            )
        }
        res.redirect(`/cart?idp=${productId}`)
    } else {
        res.redirect("/user/login")
    }
}
