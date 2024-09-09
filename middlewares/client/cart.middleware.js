const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");

module.exports.cartId = async (req, res, next) => {
    const cartId = req.cookies.cartId;
    const user = res.locals.infoUser
    res.locals.miniCart = 0;
    if (user) {
        if (!cartId) {
            const checkCart = await Cart.findOne({
                user_id: user.id
            })
            if (!checkCart) {

                const cart = await Cart.create({
                    user_id: user.id
                });
                res.cookie("cartId", cart.id);
                res.locals.miniCart = cart.products.length;
            } else {
                res.cookie("cartId", checkCart.id);
                res.locals.miniCart = checkCart.products.length
            }
            next();
        } else {
            const cart = await Cart.findOne({
                _id: cartId,
            })
            if (cart) {
                res.cookie("cartId", cart.id);
                res.locals.miniCart = cart.products.length
                next();
            } else {
                res.clearCookie("cartId");
                res.redirect("/");
                return;
            }
        }
    } else {
        next();
    }
}