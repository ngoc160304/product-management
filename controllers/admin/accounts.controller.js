const Account = require("../../models/account.model");
const Roles = require("../../models/roles.model");
const systemConfig = require("../../config/system");
const md5 = require('md5')

// [GET] admin/accounts/
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token");
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}

// [GET] admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Roles.find({
        deleted: false
    })
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    })
}

// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("accounts_create")) {
        req.body.password = md5(req.body.password);
        const emailExists = await Account.findOne({
            email: req.body.email,
            deleted: false
        });
        if(emailExists) {
            req.flash("error", "email đã tồn tại !");
            res.redirect("back");
            return;
        }
        req.body.createdBy = {
            account_id: res.locals.user.id
        }
        await Account.create(req.body);
        req.flash("success", "Tạo tài khoản thành công")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    } else {
        return;
    }
}

// [PATCH] admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("accounts_edit")) {
        const updated = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Account.updateOne(
            {
                _id: req.params.id
            },
            {
                status: req.params.status,
                $push: {
                    updatedBy: updated
                }
            }
        )
        req.flash("success", "Cập nhật trạng thái thành công !");
        res.redirect("back");
    } else {
        return;
    }
}

// [GET] admin/accounts/details/:id
module.exports.details = async (req, res) => {
    const data = await Account.findOne({
        _id: req.params.id,
        deleted: false
    })
    res.render("admin/pages/accounts/details", {
        pageTitle: "Chi tiết tài khoản",
        data: data
    })
}

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const data = await Account.findOne({
        _id: req.params.id,
        deleted: false,
    })
    const roles = await Roles.find({
        deleted: false
    })
    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles
    })
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("accounts_edit")) {
        const updated = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        const emailExists = await Account.findOne({
            _id: {$ne: req.params.id},
            email: req.body.email,
            status: "active",
            deleted: false
        })
        if(emailExists) {
            req.flash("error", "Email đã tồn tại !");
            res.redirect("back")
            return;
        }
        await Account.updateOne(
            {
                _id: req.params.id
            },
            {
                ...req.body,
                $push: {
                    updatedBy: updated
                }
            }
        )
        req.flash("success", "Cập nhật thành công !");
        res.redirect(`back`);
    } else {
        return;
    }
}

// [DELETE] admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("accounts_delete")) {
        await Account.updateOne(
            {
                _id: req.params.id
            },
            {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                },
            }
        )
        res.redirect("back")
    } else {
        return;
    }
}

// [GET] admin/accounts/edit-password/:id
module.exports.editPassword = (req, res) => {
    const idUser = req.params.id
    res.render("admin/pages/accounts/edit-password", {
        pageTitle: "Thay đổi mật khẩu",
        idUser: idUser
    })
}

// [PATCH] admin/accounts/edit-password/:id
module.exports.editPasswordPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("accounts_edit")) {
        await Account.updateOne(
            {
                _id: req.params.id
            },
            {
                password: md5(req.body.password)
            }
        )
        res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${req.params.id}`)
    } else {
        return;
    }
}