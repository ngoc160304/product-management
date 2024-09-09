// Kiểm tra số lượng sản phẩm khi người dùng đã vượt quá số lượng và hàng vẫn còn
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [GET] cart/
module.exports.index = async (req, res) => {
    const productId = req.query.idp;
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });
    for (const item of cart.products) {
        const product = await Product.findOne({
            _id: item.product_id
        });
        item.product = productHelper.productPriceNew(product);
        item.totalPrice = (item.product.priceNew * item.quantity).toFixed(2);
    }
    const totalPrice = cart.products.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
    cart.totalPrice = (totalPrice).toFixed(2);
    res.render("client/pages/cart/index.pug", {
        pageTitle: "Giỏ hàng",
        cart: cart,
        productId: productId ? productId : ""
    })

}

// [POST] cart/add/:productId
module.exports.addCart = async (req, res) => {
    const cartId = req.cookies.cartId;
    const quantityProduct = parseInt(req.body.quantity);
    const productId = req.params.productId;
    const cart = await Cart.findOne({
        _id: cartId
    })
    const product = await Product.findOne({
        _id: productId
    }).select("stock");
    if (quantityProduct <= 0) {
        res.redirect("back");
        req.flash("error", "Số lượng sản phẩm không hợp lê !")
        return;
    }
    if (quantityProduct >= product.stock) {
        res.redirect("back");
        req.flash("error", "Số lượng sản phẩm không hợp lê !")
        return;
    }
    const productIdx = cart.products.findIndex((item) => item.product_id == productId);
    if (productIdx < 0) {
        const product = {
            product_id: productId,
            quantity: quantityProduct
        }
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: {
                    products: product
                }
            }
        )
    } else {
        await Cart.updateOne(
            {
                _id: cartId
            },
            { $set: { [`products.${productIdx}.quantity`]: cart.products[productIdx].quantity + quantityProduct } }
        )
    }
    res.redirect("back")
}

// [PATCH] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    const product = await Product.findOne({
        _id: productId
    }).select("stock");
    if (quantity <= 0) {
        res.redirect("back");
        req.flash("error", "Số lượng sản phẩm không hợp lê !")
        return;
    }
    if (quantity >= product.stock) {
        res.redirect("back");
        req.flash("error", "Số lượng sản phẩm không hợp lê !")
        return;
    }
    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId
        },
        {
            $set: { "products.$.quantity": quantity }
        }
    )
    res.redirect("back");

}

// [DELETE] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            $pull: {
                'products': {
                    product_id: productId
                }
            }
        }
    )
    res.redirect("back")

}

// [DELETE] /cart/delete-all
module.exports.deleteAll = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productIds = req.body.ids.split("-");
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            $pull: {
                products: {
                    product_id: {
                        $in: [...productIds]
                    }
                }
            }
        }
    )
    res.redirect("back");

}

// [POST] /purchase-multi
module.exports.purchaseMulti = (req, res) => {
    req.session.products = req.body.products
    res.redirect("/checkout")
}