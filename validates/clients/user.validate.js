const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const phoneNumberRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
module.exports.registerPost = (req, res, next) => {
    const { fullname, email, password, phone, pass_confirm } = req.body;
    if(fullname === "") {
        req.flash("error", "Vui lòng nhập tên đăng nhâp !");
        res.redirect("back");
        return;
    }
    if(email === "") {
        req.flash("error", "Vui lòng nhập địa chỉ email !");
        res.redirect("back");
        return;
    }
    if(!emailRegex.test(email)) {
        req.flash("error", "Địa chỉ email không hợp lệ !");
        res.redirect("back");
        return;
    }
    if(phone === "") {
        req.flash("error", "Vui lòng nhập số điện thoại");
        res.redirect("back");
        return;
    }
    if(!phoneNumberRegex.test(phone)) {
        req.flash("error", "Vui lòng nhập số điện thoại chính xác !");
        res.redirect("back");
        return;
    }
    if(password === "") {
        req.flash("error", "Vui lòng nhập mật khẩu !");
        res.redirect("back");
        return;
    }
    if(!passwordRegex.test(password)) {
        req.flash("error", "Mật khẩu không hợp lệ !");
        res.redirect("back");
        return;
    }
    if(pass_confirm === "") {
        req.flash("error", "Vui lòng xác nhận mật khẩu !");
        res.redirect("back");
        return;
    }
    if(pass_confirm !== password) {
        req.flash("error", "Mật khẩu xác nhận không chính xác !");
        res.redirect("back");
        return;
    }
    next();
}
 
module.exports.loginPost = (req, res, next) => {
    const { email, password } = req.body;
    if(email === "") {
        req.flash("error", "Vui lòng nhập địa chỉ email !");
        res.redirect("back");
        return;
    }
    if(!emailRegex.test(email)) {
        req.flash("error", "Địa chỉ email không hợp lệ !");
        res.redirect("back");
        return;
    }
    if(password === "") {
        req.flash("error", "Vui lòng nhập mật khẩu !");
        res.redirect("back");
        return;
    }
    next()
}

module.exports.resetPasswordPost = (req, res, next) => {
    const { password,  pass_confirm } = req.body;
    if(password === "") {
        req.flash("error", "Vui lòng nhập mật khẩu !");
        res.redirect("back");
        return;
    }
    if(!passwordRegex.test(password)) {
        req.flash("error", "Mật khẩu không hợp lệ !");
        res.redirect("back");
        return;
    }
    if(pass_confirm === "") {
        req.flash("error", "Vui lòng xác nhận mật khẩu !");
        res.redirect("back");
        return;
    }
    if(pass_confirm !== password) {
        req.flash("error", "Mật khẩu xác nhận không chính xác !");
        res.redirect("back");
        return;
    }
    next();
}