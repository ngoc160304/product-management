const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
// router private
module.exports.authentic = async (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        const user = await Account.findOne({
            token: token,
            deleted: false,
            status: "active"
        }).select("-password -token");
        if(!user) {
            res.clearCookie("token");
            res.redirect("/admin");
            return;
        } else {
            const role = await Role.findOne({
                _id: user.role_id
            }).select("permissions")
            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    } else {
        res.redirect("/admin");
    }
}