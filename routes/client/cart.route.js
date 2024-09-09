const app = require("express");
const router = app.Router();

const controller = require("../../controllers/clients/cart.controller");

// cart/
router.get("/", controller.index)

// cart/add/:productId
router.post("/add/:productId", controller.addCart);

// cart/update/:productId/:quantity
router.patch("/update/:productId/:quantity", controller.update)

// cart/delete/:productId
router.delete("/delete/:productId", controller.delete);

// cart/delete-all
router.delete("/delete-all", controller.deleteAll)

// cart/purchase-multi
router.post("/purchase-multi", controller.purchaseMulti)

module.exports = router;