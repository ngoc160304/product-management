const Product = require("../../models/product.model");
const filterSearchHelper = require("../../helpers/filterSearch");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTreeView");
const ProductsCategory = require("../../models/products-category.model");
const Account = require("../../models/account.model");

// [GET] admin/product
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    // Filter
    const filterSearch = filterSearchHelper(req.query);
    
    if(req.query.status) {
        find.status = req.query.status;
    }
    
    // Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.keyword) {
        find.title = objectSearch.regex;
    }
    
    // Pagination
    const totalPage = await Product.countDocuments(find);
    const objectPagination = paginationHelper(
        {
            limitItems: 10,
            currentPage: 1
        },
        req.query,
        totalPage
    )

    // Select sort
    const objectSort = {}
    if(req.query.sort_key && req.query.sort_value) {
        objectSort[req.query.sort_key] = req.query.sort_value;
    } else {
        objectSort.position = "desc";
    }


    
    const products = await Product.find(find)
        .sort(objectSort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    for(let i = 0; i < products.length; i++) {
        if(products[i].createdBy.account_id) {
            const name = await Account.findOne({
                _id: products[i].createdBy.account_id
            })
            products[i].fullnameCreate = name.fullname;
        }

    }

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Admin",
        products: products,
        filterSearch: filterSearch,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    const updated = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    if(permissions.includes("products_edit")) {
        try {
            await Product.updateOne(
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
            req.flash('success', 'Thay đổi trạng thái sản phẩm thành công !');
            res.redirect('back');
        } catch (error) {
            req.flash('error', 'Thay đổi trạng thái thất bại !')
            res.redirect('back');
        }
    } else {
        return;
    }
}

// [PATCH] admin/products/change-multi
// [DELETE] admin/products/deleteall
// Change position
module.exports.changeMulti = async (req, res) => {
    const permissions = res.locals.role.permissions;
    const type = req.body.type;
    const ids = req.body.ids.split(" ");
    const updated = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":
            if(permissions.includes("products_edit")) {
                try {
                    await Product.updateMany({ _id: { $in: ids } },{ 
                        status: "active" ,
                        $push: {
                            updatedBy: updated
                        }
                    })
                    req.flash('success', 'Thay đổi trạng thái sản phẩm thành công !');
                    
                } catch (error) {
                    req.flash('error', 'Thay đổi trạng thái thất bại !')
                }
            } else {
                return;
            }
            break; 
        case "inactive":
            if(permissions.includes("products_edit")) {
                try {
                    await Product.updateMany({ _id: { $in: ids } },{
                        status: "inactive",
                        $push: {
                            updatedBy: updated
                        }
                    })
                    req.flash('success', 'Thay đổi trạng thái sản phẩm thành công !');
                } catch (error) {
                    req.flash('error', 'Thay đổi trạng thái thất bại !');
                }
            } else {
                return;
            }
            break;
        case "deleteall":
            if(permissions.includes("products_delete")) {
                try {
                    await Product.updateMany({ _id: { $in: ids } },{ 
                        deleted : true,
                        deletedBy: {
                            account_id: res.locals.user.id,
                            deletedAt: new Date()
                        },
                    })
                    req.flash('success', 'Xóa sản phẩm thành công !');
                } catch (error) {
                    req.flash('error', 'Xóa sản phẩm thất bại !');
                }
            } else {
                return;
            }
            break;
        case "change-position":
            if(permissions.includes("products_edit")) {
                try {
                    for (const item of ids) {
                        const [id, position] = item.split("-");
                        await Product.updateOne(
                            {
                                _id : id
                            },
                            {
                                position: parseInt(position),
                                $push: {
                                    updatedBy: updated
                                }
                            }
                        )
        
                    }
                    req.flash('success', 'Thay đổi vị trí sản phẩm thành công !');
                    
                } catch (error) {
                    req.flash('error', 'Thay đổi vị trí sản phẩm thất bại !');
                }
            } else {
                return;
            }
            break;
        default:
            break;
    }
    res.redirect('back');
}

// [DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("products_delete")) {
        try {
            await Product.updateOne( 
                { _id : req.params.id }, 
                {
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date()
                    },
                    deleted : true
                }
            )
            req.flash("error", "Xóa sản phẩm thành công !");
        } catch (error) {
            req.flash("error", "Xóa sản phẩm thất bại !");
        }
    } else {
        return;
    }
    res.redirect("back")
}
// [GET] admin/products/create
module.exports.create = async (req, res) => {
    const records = await ProductsCategory.find({
        deleted: false
    })
    const newRecords = createTreeHelper.treeView(records);
    res.render("admin/pages/products/create.pug", {
        records: newRecords,
        pageTitle : "Tạo mới sản phẩm"
    });
}
// [POST] admin/products/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("products_create")) {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if(req.body.position === '') {
            const position = await Product.countDocuments({});
            req.body.position = position + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }
        req.body.createdBy = {
            account_id: res.locals.user.id
        }
        try {
            await Product.create(req.body);
            req.flash("success", "Thêm mới sản phẩm thành công !");
            res.redirect(`${systemConfig.prefixAdmin}/products`);
        } catch (error) {
            req.flash("success", "Thêm mới sản phẩm thất bại !");
            res.redirect('back');
        }
    } else {
        return;
    }
  
}
// [GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const records = await ProductsCategory.find({
        deleted: false
    })
    const newRecords = createTreeHelper.treeView(records);
    const id = req.params.id;
    const productItem = await Product.findOne({ _id : id });
    res.render("admin/pages/products/edit.pug", {
        pageTitle : "Chỉnh sửa sản phẩm",
        records: newRecords,
        product : productItem
    });
}

// [PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(permissions.includes("products_edit")) {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);
        const updated = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        try {
            await Product.updateOne(
                {
                    _id : req.params.id
                },
                {
                    ...req.body,
                    $push: {
                        updatedBy: updated
                    }
                }
            )
            req.flash("success", "Cập nhật sản phẩm thành công !");
            res.redirect('back');
        } catch (error) {
            req.flash("error", "Cập nhật sản phẩm thất bại !");
            res.redirect('back');
        }

    }
}
module.exports.details = async (req, res) => {
    try {
        const product = await Product.findOne({
            slug : req.params.slug,
            deleted : false
        })
        // const pageTitle = product.title;
        res.render("admin/pages/products/details.pug", {
            pageTitle : "Product detail",
            product : product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}