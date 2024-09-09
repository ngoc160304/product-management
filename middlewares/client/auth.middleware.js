const User = require("../../models/user.model");
module.exports.auth = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;
    if (tokenUser) {
        const user = await User.findOne({
            tokenUser: tokenUser
        }).select("-password")
        if (user) {
            res.locals.infoUser = user;
            next();
        } else {
            res.clearCookie("tokenUser");
            res.redirect("/user/login");
        }
    } else {
        res.redirect("/user/login");
    }
}

module.exports.authenUnlogin = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;
    if (tokenUser) {
        res.redirect("/");
    } else {
        next();
    }
}

module.exports.authenLogged = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;
    if (tokenUser) {
        next();
    } else {
        res.redirect("/")
    }
}
