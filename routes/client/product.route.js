const app = require("express");
const router = app.Router();

const controller = require("../../controllers/clients/product.controller");
// /products
router.get("/", controller.index);

// products/:slugCategory
router.get("/:slugCategory", controller.category)

// products/detail/:slugTitlte
router.get("/detail/:slugTitle", controller.detail)

// products/buy-now/:productId
router.post("/buy-now/:productId", controller.buyNow)
module.exports = router;