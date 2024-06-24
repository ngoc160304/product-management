const Product = require("../../models/product.model");
const filterSearchHelper = require("../../helpers/filterSearch");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

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
            limitItems: 4,
            currentPage: 1
        },
        req.query,
        totalPage
    )
    const products = await Product.find(find)
        .sort({position : "desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
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
    await Product.updateOne(
        {
            _id: req.params.id
        },
        {
            status: req.params.status
        }
    )
    req.flash('success', 'Thay đổi trạng thái sản phẩm thành công !');
    res.redirect('back');
}

// [PATCH] admin/products/change-multi
// [DELETE] admin/products/deleteall
// Change position
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(" ");
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } },{ 
                status: "active" ,
            })
            req.flash('success', 'Thay đổi trạng thái sản phẩm thành công !');
            break; 
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } },{ status: "inactive" })
            req.flash('success', 'Thay đổi trạng thái sản phẩm thành công !');
            break;
        case "deleteall":
            await Product.updateMany({ _id: { $in: ids } },{ 
                deleted : true,
                deletedAt : new Date()
            })
            req.flash('success', 'Xóa sản phẩm thành công !');
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                await Product.updateOne(
                    {
                        _id : id
                    },
                    {
                        position: parseInt(position)
                    }
                )

            }
            req.flash('success', 'Thay đổi vị trí sản phẩm thành công !');
            break;
        default:
            break;
    }
    res.redirect('back');
}

// [DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    await Product.updateOne( { _id : req.params.id }, { deleted : true})
    res.redirect("back")
}
// [GET] admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create.pug", {
        pageTitle : "Tạo mới sản phẩm"
    });
}
// [POST] admin/products/create
module.exports.createPost = async (req, res) => {
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
   
    await Product.create(req.body);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}
// [GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const productItem = await Product.findOne({ _id : id });
    res.render("admin/pages/products/edit.pug", {
        pageTitle : "Chỉnh sửa sản phẩm",
        product : productItem
    });
}

// [PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    try {
        await Product.updateOne(
            {
                _id : req.params.id
            },
            req.body
        )
        res.redirect('back');
    } catch (error) {
        req.flash("error", "Khong the cap nhat san pham");
        res.redirect('back');
    }
}
module.exports.details = async (req, res) => {
    
    const product = await Product.findOne({
        slug : req.params.slug,
        deleted : false
    })
    // const pageTitle = product.title;
    res.render("admin/pages/products/details.pug", {
        pageTitle : "Product detail",
        product : product
    })
}