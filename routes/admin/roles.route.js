const app = require("express");
const router = app.Router();

const controller = require("../../controllers/admin/roles.controller");

const validate = require("../../validates/admin/roles.validate")

// admin/roles
router.get("/", controller.index);

// admin/roles/create
router.get("/create", controller.create);

// admin/roles/create
router.post(
    "/create",
    validate.createPost,
    controller.createPost
)

// admin/roles/edit/:id
router.get(
    "/edit/:id",
    controller.edit
)

// admin/roles/edit/:id
router.patch(
    "/edit/:id",
    validate.createPost,
    controller.editPatch
)

// admin/roles/details/:id
router.get("/details/:id", controller.details)

// admin/roles/details/delete/:id
router.delete("/delete/:id", controller.deleteItem)

// admin/roles/permissisons
router.get("/permissions", controller.permissions)

// admin/roles/permissions
router.patch("/permissions", controller.permissionsPatch)


module.exports = router;