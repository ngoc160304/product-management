const app = require("express");
const router = app.Router();

const controller = require("../../controllers/admin/my-account.controller");

const validate = require("../../validates/admin/my-account.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// Upload img
const multer  = require('multer')
const upload = multer();

// admin/my-account
router.get("/", controller.myAccount);

// admin/my-account/edit
router.patch(
    "/edit",
    upload.single('avatar'), 
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch,
)

// admin/my-account/edit-password
router.get(
    "/edit-password",
    controller.editPassword   
)
// admin/my-account/edit-password
router.patch(
    "/edit-password",
    validate.confirmPassword,
    controller.editPasswordPatch
)
module.exports = router;