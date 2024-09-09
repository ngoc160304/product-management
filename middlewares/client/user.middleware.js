const User = require("../../models/user.model");
module.exports.userInfo = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;
    if(tokenUser) {
        const infoUser = await User.findOne({
            tokenUser: tokenUser,
            status: "accept",
            deleted: false
        }).select("-password");
        if(infoUser) {
            res.locals.infoUser = infoUser;
        } else {
            res.clearCookie("tokenUser");
            res.redirect("/");
            return;
        }
    }
    next();
}
