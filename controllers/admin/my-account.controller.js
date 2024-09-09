const Account = require("../../models/account.model");
const Roles = require("../../models/roles.model");

const systemConfig = require("../../config/system");
const md5 = require('md5');
// [GET] /admin/my-account
module.exports.myAccount = async (req, res) => {
    const roles = await Roles.find({
        deleted: false
    })
    res.render("admin/pages/my-account/index", {
        pageTitle : res.locals.user.fullname,
        roles: roles
    });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    const user = res.locals.user;
    const emailExists = await Account.findOne({
        _id: {$ne: user.id},
        email: req.body.email,
        status: "active",
        deleted: false
    })
    if(emailExists) {
        req.flash("error", "email đã tồn tại !");
        res.redirect("back");
        return;
    }
    const updated = {
        account_id: user.id,
        updatedAt: new Date()
    }
    if(!permissions.includes("accounts_edit")) {
        delete req.body.role_id;
    }
    await Account.updateOne(
        {
            _id: user.id
        },
        {
            ...req.body,
            $push: {
                updatedBy: updated
            }
        }
    )
    req.flash("success", "Cập nhật thành công !");
    res.redirect("back");
   
}


// [GET] admin/my-account/edit-password
module.exports.editPassword = (req, res) => {
    res.render("admin/pages/my-account/edit-password", {
        pageTitle: "Thay đổi mật khẩu"
    })
}

// [PATCH] admin/my-account/edit-password
module.exports.editPasswordPatch = async (req, res) => {
    await Account.updateOne(
        {
            _id: res.locals.user.id
        },
        {
            password: md5(req.body.password)
        }
    )
    req.flash("success", "Thay đổi mật khẩu thành công !");
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
}