const app = require('express');
const router = app.Router();

const controller = require("../../controllers/admin/products-category.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// Upload img
const multer  = require('multer')
const upload = multer();

// validate
const validates = require("../../validates/admin/products-category.validate");



// admin/products-category/
router.get("/", controller.index);

// admin/products-category/change-status/:status/:id
router.patch("/change-status/:status/:id", controller.changeStatus);

// admin/products-category/create
router.get("/create", controller.create)

// admin/products-cateogry/create
router.post(
    "/create", 
    upload.single('thumbnail'), 
    validates.createPost,
    uploadCloud.upload,
    controller.createPost
);

// admin/products-category/edit/:id
router.get('/edit/:id', controller.edit)

// admin/products-category/edit/:id
router.patch(
    "/edit/:id", 
    upload.single('thumbnail'), 
    validates.createPost,
    uploadCloud.upload,
    controller.editPatch
)


// admin/products-category/details/:slug
router.get("/details/:slug", controller.details)




module.exports = router;