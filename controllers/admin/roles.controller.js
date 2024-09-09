const Roles = require("../../models/roles.model");
// [GET] admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const records = await Roles.find(find);
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}
// [GET] admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo mới nhóm quyền"
    })
}
// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("roles_create")) {
        try {
            req.body.createdBy = {
                account_id: res.locals.user.id
            }
            await Roles.create(req.body);
        } catch (error) {
            console.log(error);
        }
        res.redirect('/admin/roles');
    } else {
        return;
    }
}

// [GET] admin/roles/edit/"if"
module.exports.edit = async (req, res) => {
    const record = await Roles.findOne({
        _id: req.params.id
    })
    res.render("admin/pages/roles/edit.pug", {
        pageTitle: "Chỉnh sủa nhóm quyền",
        record: record
    })
}

// [PATCH] admin/reoles/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("roles_edit")) {
        const updated = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Roles.updateOne(
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
        res.redirect("back")
    } else {
        return;
    }
}
module.exports.details = async (req, res) => {
    const data = await Roles.findOne({
        _id: req.params.id
    })
    res.render("admin/pages/roles/details.pug", {
        pageTitle: "Chi tiết danh mục",
        data: data
    })
}

// [DELETE] admin/roles/details/delete/:id
module.exports.deleteItem = async (req, res) => {
    await Roles.updateOne(
        {
            _id: req.params.id
        },
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        }
    )
    res.redirect('back');
}


// [GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const find = {
        deleted: false
    }
    const records = await Roles.find(find);
    res.render("admin/pages/roles/permissions.pug", {
        pageTitle : "Phân quyền",
        records: records
    })
}

// [PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissionslist = res.locals.role.permissions;
    if(permissionslist.includes("roles_permissions")) {
        const updated = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        console.log(req.body);
        const permissions = JSON.parse(req.body.permissions);
        console.log(permissions);
        for(let i = 0; i < permissions.length; i++) {
            await Roles.updateOne(
                {
                    _id: permissions[i].id
                },
                {
                    permissions: permissions[i].permissions,
                    $push: {
                        updatedBy: updated
                    }            
                }
            )
        }
        res.redirect("back")
    } else {
        return;
    }
}