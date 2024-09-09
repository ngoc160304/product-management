const app = require("express");
const router = app.Router();

const controller = require("../../controllers/clients/checkout.controller");

// /checkout
router.get("/", controller.index);

// /checkout/orders
router.post("/orders", controller.ordersPost)

// /checkout//success/:orderId
router.get("/success/:orderId", controller.success)

// /checkout/online-payment
router.get("/online-payment", controller.onlinePayment)

// /checkout/online-payment
router.post("/online-payment", controller.onlinePaymentPost)

// /checkout/vnpay_return
router.get('/vnpay_return', controller.paymentResult)


module.exports = router;