const adminRouter = require("./admin.route")
const dashboardRouter = require("./dashboard.route");
const productsRouter = require("./products.route");
const productsCategoryRouter = require("./products-category.route")
const rolesRouter = require("./roles.route");
const accountRouter = require("./accounts.route");
const myAccountRouter = require("./my-account.route");
const systemConfig = require("../../config/system");

const authentication = require("../../middlewares/admin/auth.middleware");


module.exports = (app) => {
    app.use(`${systemConfig.prefixAdmin}`, adminRouter);
    app.use(`${systemConfig.prefixAdmin}/dashboard`, authentication.authentic, dashboardRouter);
    app.use(`${systemConfig.prefixAdmin}/products`, authentication.authentic, productsRouter);
    app.use(`${systemConfig.prefixAdmin}/products-category`, authentication.authentic, productsCategoryRouter);
    app.use(`${systemConfig.prefixAdmin}/roles`, authentication.authentic, rolesRouter);
    app.use(`${systemConfig.prefixAdmin}/accounts`, authentication.authentic, accountRouter);
    app.use(`${systemConfig.prefixAdmin}/my-account`, authentication.authentic, myAccountRouter);
}