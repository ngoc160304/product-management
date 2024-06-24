const app = require("express");
const router = app.Router();

const controller = require("../../controllers/admin/dashborad.controller");

router.get("/", controller.index);

module.exports = router;