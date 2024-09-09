const app = require("express");
const router = app.Router();

const controller = require("../../controllers/admin/accounts.controller")

const validate = require("../../validates/admin/accounts.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// Upload img
const multer  = require('multer')
const upload = multer();




// admin/accounts/
router.get("/", controller.index)

// admin/accounts/create
router.get("/create", controller.create)

// admin/accounts/create
router.post(
    "/create",
    upload.single('avatar'), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost,
)

// admin/accounts/change-status/:status/:id
router.patch("/change-status/:status/:id", controller.changeStatus)


// admin/accounts/details/:id
router.get("/details/:id", controller.details)

// admin/accounts/edit/:id
router.get("/edit/:id", controller.edit)

// admin/accounts/edit/:id
router.patch(
    "/edit/:id", 
    upload.single('avatar'), 
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch,
)

// admin/accounts/delete/:id
router.delete( "/delete/:id", controller.delete)

// admin/account/edit-password/:id
router.get(
    "/edit-password/:id",
    controller.editPassword
)
// admin/account/edit-password/:id
router.patch(
    "/edit-password/:id",
    validate.confirmPasswrod,
    controller.editPasswordPatch
)
module.exports = router;