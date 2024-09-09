const app = require("express");
const router = app.Router();

const controller = require("../../controllers/admin/admin.controller");


// admin/
router.get("/", controller.login);

// admin
router.post("/", controller.loginPost);


// admin/logout
router.get("/logout", controller.logout)
module.exports = router;