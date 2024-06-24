const app = require("express");
const router = app.Router();

const controller = require("../../controllers/admin/product.controller");

// const storageMulter = require("../../helpers/storageMulter");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// Upload img
const multer  = require('multer')
const upload = multer();

// Validates
const validates = require("../../validates/admin/product.validate");

// [GET] admin/products
router.get("/", controller.index);

// [PATCH] admin/products/change-status/:status/:id
router.patch("/change-status/:status/:id", controller.changeStatus)

// [PATCH] admin/products/change-multi
// [DELETE] admin/products/deleteall
router.patch("/change-multi", controller.changeMulti)

// [DELETE] admin/products/delete/:id
router.delete("/delete/:id", controller.deleteItem)

// [GET] admin/products/create
router.get("/create", controller.create)

// [POST] admin/products/create
router.post(
    "/create", 
    upload.single('thumbnail'), 
    validates.createPost,
    uploadCloud.upload,
    controller.createPost
);

// [GET] admin/products/edit/:id
router.get(
    "/edit/:id", 
    controller.edit
)
// [PATCH] admin/products/edit/:id
router.patch(
    "/edit/:id",
    upload.single('thumbnail'), 
    validates.createPost,
    uploadCloud.upload,
    controller.editPatch
)

// [GET] admin/products/detail/:slug
router.get("/details/:slug", controller.details)

module.exports = router;