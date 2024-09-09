const ProductsCategory = require("../../models/products-category.model")
const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTreeView");
const filterSearchHelper = require("../../helpers/filterSearch");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const pagination = require("../../helpers/pagination");
// [GET] admin/products-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const filterSearch = filterSearchHelper(req.query);
    if(req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
    if(req.query.keyword) {
        find.title = objectSearch.regex;
    }
    const totalPage = await ProductsCategory.countDocuments(find);
    const objectPagination = paginationHelper(
        {
            limitItems: 10,
            currentPage: 1
        },
        req.query,
        totalPage
    )

    const records = await ProductsCategory
        .find(find)
    const newRecords = createTreeHelper.treeView(records);
    console.log(newRecords);
    res.render("admin/pages/productsCategory/index.pug", {
        records: newRecords,
        filterSearch: filterSearch,
        keyword: objectSearch.keyword,
        pageTitle: "Danh mục sản phẩn"
    })
}
// [PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    await ProductsCategory.updateOne(
        {
            _id: req.params.id
        },
        {
            status: req.params.status
        }
    )
    res.redirect("back");
}



// [GET] admin/products-category/create
module.exports.create = async (req, res) => {

    const records = await ProductsCategory.find({
        deleted: false
    });
    const newRecords = createTreeHelper.treeView(records);

    res.render("admin/pages/productsCategory/create.pug", {
        records: newRecords,
        pageTitle: "Tạo mới danh mục"
    })
}

// [POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position === '') {
        const position = await ProductsCategory.countDocuments({
            deleted : false
        });
        req.body.position = position + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    await ProductsCategory.create(req.body);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

// [GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    const records = await ProductsCategory.find({
        deleted: false
    });
    const data = await ProductsCategory.findOne({
        _id: req.params.id
    })
    const newRecords = createTreeHelper.treeView(records);

    res.render("admin/pages/productsCategory/edit.pug",{
        data: data,
        records: newRecords,
        pageTitle: "Chỉnh sủa danh mục"
    });
}

// [PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.position = parseInt(req.body.position);
    if(!req.body.thumbnail) {
        req.body.thumbnail = "";
    }
    await ProductsCategory.updateOne({ _id: req.params.id }, req.body)
    res.redirect('back')
}

// [GET] admin/products-category/details/:slug
module.exports.details = async (req, res) => {
    const record = await ProductsCategory.findOne({
        slug: req.params.slug
    });
    res.render("admin/pages/productsCategory/details.pug", {
        pageTitle: "Chi tiết danh mục",
        record: record
    })
}