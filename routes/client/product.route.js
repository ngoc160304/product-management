const app = require("express");
const router = app.Router();

const controller = require("../../controllers/clients/product.controller");

router.get("/", controller.index);


module.exports = router;