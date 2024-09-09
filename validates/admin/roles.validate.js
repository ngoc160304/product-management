module.exports.createPost = (req, res, next) => {
    if(req.body.title === '') {
        console.log("OK")
        req.flash('error', "Vui lòng nhập tiêu dề");
        res.redirect('back');
        return;
    }
    next();
}