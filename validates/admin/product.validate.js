module.exports.createPost = (req, res, next) => {
    if(req.body.title === '') {
        req.flash('error', "Vui lòng nhập tiêu dề");
        res.redirect('back');
        return;
    }
    if(req.body.category_id === '') {
        req.flash('error', 'Vui lòng chọn danh mục');
        res.redirect('back');
        return;
    }
    next();
}