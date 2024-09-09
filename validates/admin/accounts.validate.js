const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const phoneNumberRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
module.exports.createPost = (req, res, next) => {
    const {fullname, email, password, phone, role_id } = req.body;
    if(fullname === "") {
        req.flash("error", "Vui lòng nhập họ tên !");
        res.redirect("back");
        return;

    }
    if(email === "") {
        req.flash("error", "Vui lòng nhập địa chỉ email !");
        res.redirect("back");
        return;
    }
    if(!emailRegex.test(email)) {
        req.flash("error", "Vui lòng nhập email chính xác !");
        res.redirect("back");
        return;
    }
    if(password === "") {
        req.flash("error", "Vui lòng nhập mật khẩu !");
        res.redirect("back");
        return;
    }
    if(!passwordRegex.test(password)) {
        req.flash("error", "Mật khẩu sai quy định !");
        res.redirect("back");
        return;
    }
    if(role_id === "") {
        req.flash("error", "Vui lòng chọn nhóm quyền !");
        res.render("back");
        return;
    }
    if(req.body.phone) {
        if(!phoneNumberRegex.test(phone)) {
            req.flash("error", "Vui lòng nhập số điện thoại chính xác !");
            res.redirect("back");
            return;
        }
    }
    next();
}

module.exports.editPatch = (req, res, next) => {
    const {fullname, email, password, phone, role_id } = req.body;
    if(fullname === "") {
        req.flash("error", "Vui lòng nhập họ tên !");
        res.redirect("back");
        return;

    }
    if(email === "") {
        req.flash("error", "Vui lòng nhập địa chỉ email !");
        res.redirect("back");
        return;
    }
    if(!emailRegex.test(email)) {
        req.flash("error", "Vui lòng nhập email chính xác !");
        res.redirect("back");
        return;
    }
    if(role_id === "") {
        req.flash("error", "Vui lòng chọn nhóm quyền !");
        res.render("back");
        return;
    }
    if(req.body.phone) {
        if(!phoneNumberRegex.test(phone)) {
            req.flash("error", "Vui lòng nhập số điện thoại chính xác !");
            res.redirect("back");
            return;
        }
    }
    next();
}

module.exports.confirmPasswrod = (req, res, next) => {
    if(req.body.password === "") {
        req.flash("error", "Vui lòng nhập mật khẩu !");
        res.redirect("back");
        return;
    }
    if(!passwordRegex.test(req.body.password)) {
        req.flash("error", "Vùi lòng nhập mật khẩu chính xác !");
        res.redirect("back");
        return;
    }
    next();
}