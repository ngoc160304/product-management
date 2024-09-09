const app = require("express");
const router = app.Router();

const controller = require("../../controllers/clients/user.controller");
const validate = require("../../validates/clients/user.validate");
const authenticMiddleware = require("../../middlewares/client/auth.middleware")
// /user/register
router.get("/register", controller.register)

// /user/register
router.post(
    "/register",
    validate.registerPost,
    controller.registerPost
)

// /user/login
router.get("/login", authenticMiddleware.authenUnlogin, controller.login)

// /user/login
router.post("/login", authenticMiddleware.authenUnlogin, controller.loginPost)

// /user/logout
router.get("/logout", authenticMiddleware.authenLogged, controller.logout)

// /user/password/forget
router.get("/password/forget", authenticMiddleware.authenUnlogin, controller.forgetPassword)

// /user/password/forget
router.post("/password/forget", authenticMiddleware.authenUnlogin, controller.forgetPasswordPost)

// /user/password/otp
router.get("/password/otp", controller.otpPassword)

// /user/password/otp
router.post("/password/otp", controller.otpPasswordPost)

// /user/password/reset
router.get("/password/reset", controller.resetPassword)

// /user/password/reset
router.post(
    "/password/reset",
    validate.resetPasswordPost,
    controller.resetPasswordPost
)


// /user/info
router.get("/info", authenticMiddleware.authenLogged, controller.infoUser)


module.exports = router;