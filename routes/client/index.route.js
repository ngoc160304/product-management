const homeRouter = require("./home.route");
const productRouter = require("./product.route");
const cartRuter = require("./cart.route");
const userRouter = require("./user.route");
const checkoutRouter = require("./checkout.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const session = require('express-session');

module.exports = (app) => {
    // app.use(cartMiddleware.cartId);
    // app.use(categoryMiddleware.getCategory);
    app.use(session({ resave: true, secret: '123456', saveUninitialized: true }));
    app.use("/", userMiddleware.userInfo, cartMiddleware.cartId, categoryMiddleware.getCategory, homeRouter);
    app.use("/products", userMiddleware.userInfo, categoryMiddleware.getCategory, productRouter);
    app.use("/cart", authMiddleware.auth, cartMiddleware.cartId, cartRuter);
    app.use("/user", userRouter);
    app.use("/checkout", authMiddleware.auth, cartMiddleware.cartId, checkoutRouter);
}