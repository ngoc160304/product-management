const app = require("express");
const router = app.Router();

const controller = require("../../controllers/clients/home.controller");

router.get("/", controller.index)
module.exports = router;