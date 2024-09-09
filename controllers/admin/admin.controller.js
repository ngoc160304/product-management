const Account = require("../../models/account.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");
// [GET] /admin
module.exports.login = async (req, res) => {
    if(req.cookies.token) {
        const user = await Account.findOne({
            token: req.cookies.token
        });
        if(user) {
            res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
            return;
        } else {
            res.clearCookie("token");
        }
    }
    res.render("admin/pages/auth/login", {
        pageTitle:"Đăng nhập"
    })
}


// [POST] /admin
module.exports.loginPost = async (req, res) => {
   
    const { email, password } = req.body;
   
    const user = await Account.findOne({
        email: email,
        deleted: false
    });
    if(!user) {
        req.flash("error", "Email không tồn tại !");
        res.redirect("back");
        return;
    }
    if(user.status === "inactive") {
        req.flash("error", "Tài khoản đã bị khóa !");
        res.redirect("back");
        return;
    }
    if(md5(password) !== user.password) {
        console.log("Sai chat me m");
        req.flash("error", "Sai mật khẩu !");
        res.redirect("back");
        return;
    }
    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

// [GET] admin/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}`)
}