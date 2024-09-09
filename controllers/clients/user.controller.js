const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgetPassword = require("../../models/forget-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");
let tokenConfirm = ""
// [GET] /user/register
module.exports.register = (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const { email, password } = req.body;
    const emailExist = await User.findOne({
        email: email
    })
    if (emailExist) {
        req.flash("error", "Email đã tồn tại !");
        res.redirect("back");
        return;
    }
    delete req.body.pass_confirm;
    req.body.password = md5(password);
    await User.create(req.body)
    res.redirect("/user/login")
}
// [GET] /user/login
module.exports.login = (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    })
}
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    const cartId = req.cookies.cartId;
    const user = await User.findOne({
        email: email
    })

    if (!user) {
        req.flash("error", "Email không tồn tại !");
        res.redirect("back");
        return;
    }
    req.body.password = md5(password);
    if (req.body.password !== user.password) {
        req.flash("error", "Mật khẩu không chính xác !");
        res.redirect("back");
        return;
    }
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            user_id: user.id
        }
    )
    const expriesDate = 10000 * 60 * 60 * 24 * 365
    res.cookie("tokenUser", user.tokenUser, { expires: new Date(Date.now() + expriesDate), httpOnly: true });
    res.redirect("/")
}

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/")
}

// [GET] /user/password/forget
module.exports.forgetPassword = (req, res) => {
    res.render("client/pages/user/forget-password", {
        pageTitle: "Quên mật khẩu"
    })
}

// [POST] /user/password/forget
module.exports.forgetPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
        status: "accept"
    });
    if (!user) {
        req.flash("error", "Email không tồn tại !");
        res.redirect("back");
        return;
    }
    const otp = generateHelper.generateNumber(6);

    await ForgetPassword.create({
        email: email,
        otp: otp,
        expireAt: Date.now()
    })
    const textMail = `Mã xác nhận của bạn là : ${otp}`
    sendMailHelper.sendMail(email, "Mã xác nhận", textMail);
    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
    res.render("client/pages/user/otp-password", {
        pageTitle: "Quên mật khẩu",
        email: req.query.email
    })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const otp = req.body.otp.join("");
    const email = req.body.email;
    const userConfirm = await ForgetPassword.findOne({
        otp: otp,
        email: email
    })
    if (!userConfirm) {
        console.log("NO 1")
        res.redirect("back");
        req.flash("error", "Mã xác nhận không hợp lệ !");
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false,
        status: "accept"
    })
    if (!user) {
        console.log("NO 2")
        res.redirect("back");
        req.flash("Tài khoản không tồn tại !");
        return;
    }
    await User.updateOne(
        {
            email: email,
            deleted: false,
            status: "accept"
        },
        {
            otp: {
                forget_password: otp
            }
        }
    )
    res.redirect(`/user/password/reset?email=${email}&otp=${otp}`);

}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    const { email, otp } = req.query;
    if (email === "" || otp === "") {
        res.redirect("/user/login");
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false,
        status: "accept",
        otp: {
            forget_password: otp
        }
    })
    if (user) {
        const action = `/password/reset?email=${email}&otp=${otp}`
        res.render("client/pages/user/reset-password", {
            pageTitle: "Cập nhật mật khẩu",
            action: action
        })
    } else {
        res.redirect("/user/login")
    }

}


// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const { email, otp } = req.query;
    if (email === "" || otp === "") {
        res.redirect("/user/login");
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false,
        status: "accept",
        otp: {
            forget_password: otp
        }
    })
    if (user) {
        const password = req.body.password;
        User.updateOne(
            {
                email: email,
                deleted: false,
                status: "accept",
                otp: {
                    forget_password: otp
                }
            },
            {
                password: password,

            }
        )
    }
}

// [GET] /user/info
module.exports.infoUser = async (req, res) => {
    res.render("client/pages/user/user-info", {
        pageTitle: "Multicart"
    })
}
