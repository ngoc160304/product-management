const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model")
const productHelper = require("../../helpers/product")
var moment = require('moment');
var querystring = require('qs');
// [GET] /checkout
module.exports.index = async (req, res) => {
    console.log(req.session.products)
    console.log(req.session)
    try {
        const products = JSON.parse(req.session.products);
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({
            _id: cartId
        })

        for (let i = 0; i < products.length; i++) {
            let check = false;
            for (let j = 0; j < cart.products.length; j++) {
                if (products[i].product_id === cart.products[j].product_id) {
                    check = true;
                    products[i].info = await Product.findOne({
                        _id: cart.products[j].product_id,
                        status: "active",
                        deleted: false
                    })
                    products[i].info = productHelper.productPriceNew(products[i].info);
                    products[i].totalPrice = cart.products[j].quantity * products[i].info.priceNew
                    break;
                }
            }
            if (!check) {
                res.redirect("/cart");
                return;
            }
        }
        products.totalPrice = (products.reduce((total, item) => item.info.quantity * item.info.priceNew, 0)).toFixed(2);
        console.log(products.totalPrice);
        res.render("client/pages/checkout/index", {
            products: products
        })
    } catch (error) {
        console.log(error);
        res.redirect("back")
    }

    // try {
    //     products = JSON.parse(req.query.products);
    //     if (products.length === 0) {
    //         res.redirect("/cart");
    //         return;
    //     }
    //     const cartId = req.cookies.cartId;
    //     const cart = await Cart.findOne({
    //         _id: cartId
    //     })
    //     const productlist = [];
    //     for (let i = 0; i < products.length; i++) {
    //         let check = false;
    //         for (let j = 0; j < cart.products.length; j++) {
    //             if (products[i].product_id == cart.products[j].product_id) {
    //                 check = true;
    //                 let product = await Product.findOne({
    //                     _id: cart.products[j].product_id
    //                 })
    //                 product = productHelper.productPriceNew(product);
    //                 product.totalPrice = product.priceNew * cart.products[j].quantity;
    //                 product.quantity = cart.products[j].quantity;
    //                 productlist.push(product);
    //                 break;
    //             }
    //         }
    //         if (check === false) {
    //             res.redirect("/cart");
    //             return;
    //         }
    //     }
    //     const totalPrice = productlist.reduce((total, item) => item.priceNew * item.quantity, 0);

    //     res.render("client/pages/checkout/index", {
    //         products: productlist,
    //         totalPrice: totalPrice,
    //     })
    // } catch (error) {
    //     console.log(error);
    //     res.redirect("back")
    // }

}

// [POST] /checkout/orders
module.exports.ordersPost = async (req, res) => {
    // console.log(req.query)
    // res.redirect(`/checkout/success/`)
    try {
        const products = JSON.parse(req.body.products)
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({
            _id: cartId
        })
        const user = res.locals.infoUser
        const objectOrder = {
            user_id: user.id,
            cartId: cartId,
            consignee_info: {
                fullname: req.body.fullname,
                phone: req.body.phone,
                address: req.body.address
            },
            products: [],

        }
        for (const product of products) {
            let check = false;
            for (const productCart of cart.products) {
                if (product._id === productCart.product_id) {
                    check = true;
                    objectOrder.products.push({
                        product_id: productCart.product_id,
                        quantity: productCart.quantity
                    });
                    await Cart.updateOne(
                        {
                            _id: cartId
                        },
                        {
                            $pull: {
                                'products': {
                                    product_id: productCart.product_id
                                }
                            }
                        }
                    )
                    await Product.updateOne(
                        {
                            _id: productCart.product_id
                        },
                        {
                            stock: product.stock - productCart.quantity
                        }
                    )
                    break;
                }
            }
            if (!check) {
                res.redirect("/cart");
                return;
            }
        }
        const order = await Order.create(objectOrder);

        res.redirect(`/checkout/success/${order.id}`);
    } catch (error) {
        res.redirect("/cart")
    }
}

// [GET] /checkout/success
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
        _id: orderId
    })
    if (order) {
        for (const item of order.products) {
            const product = await Product.findOne({
                _id: item.product_id,
                deleted: false,
                status: "active"
            });
            console.log(product)
            item.product = productHelper.productPriceNew(product);
            item.totalPrice = (item.product.priceNew * item.quantity).toFixed(2);
        }
        const totalPrice = order.products.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
        order.totalPrice = (totalPrice).toFixed(2);
        console.log(order);
        res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng",
            order: order
        })
    } else {
        res.redirect("back")
    }
}

// [GET] /checkout/online-payment
module.exports.onlinePayment = (req, res) => {
    console.log(req.query);
    res.render("client/pages/checkout/online-payment", {
        pageTitle: "Thanh toán online",
    })
}

// [POST] /checkout/online-payment
module.exports.onlinePaymentPost = async (req, res) => {
    const user = res.locals.infoUser;
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });
    for (const item of cart.products) {
        const product = await Product.findOne({
            _id: item.product_id
        });
        item.product = productHelper.productPriceNew(product);
        item.totalPrice = (item.product.priceNew * item.quantity).toFixed(2);
    }
    const totalPrice = (cart.products.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)).toFixed(2);
    const objectOrder = {
        user_id: user.id,
        cartId: cartId,
        consignee_info: {
            fullname: req.body.fullname,
            phone: req.body.phone,
            address: req.body.address
        },
        products: cart.products
    }
    const order = await Order.create(objectOrder);
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var config = require('../../config/default.json');
    var tmnCode = config.vnp_TmnCode
    var secretKey = config.vnp_HashSecret
    var vnpUrl = config.vnp_Url

    var returnUrl = config.vnp_ReturnUrl
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // Example usage:
    const now = new Date();
    var orderId = order.id;
    var amount = totalPrice * 100;
    var bankCode = "";

    var orderInfo = req.body.orderInfo;
    var orderType = "billpayment";
    var locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 22 * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = formatDate(now);
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    function sortObject(obj) {
        var sorted = {};
        var str = [];
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    res.redirect(vnpUrl)
}

module.exports.paymentResult = async (req, res) => {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    function sortObject(obj) {
        var sorted = {};
        var str = [];
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
    vnp_Params = sortObject(vnp_Params);
    var config = require('../../config/default.json');
    var secretKey = config.vnp_HashSecret;

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");


    if (secureHash === signed) {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({
            _id: cartId
        })
        const products = cart.products.map(item => {
            return {
                quantity: item.quantity,
                product_id: item.product_id
            }
        })
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                products: []
            }
        )
        for (const product of products) {
            const productInfo = await Product.findOne({
                _id: product.product_id,
                deleted: false,
                status: "active"
            })
            if (productInfo) {
                await Product.updateOne(
                    {
                        _id: product.product_id,

                    },
                    {
                        stock: productInfo.stock - product.quantity
                    }
                )

            }
        }
        const order = await Order.findOne({
            _id: vnp_Params.vnp_TxnRef,
            deleted: false
        })
        var str = vnp_Params.vnp_PayDate;
        var dd = str.match(/.{1,2}/g);

        var date = dd[3] + '/' + dd[2] + '/' + dd[0] + dd[1] + " " + dd[4] + ':' + dd[5] + ':' + dd[6];

        const orderInfo = {
            ...order._doc,
            payment_info: {
                amount: vnp_Params.vnp_Amount,
                purchase_date: date,
                bank_code: vnp_Params.vnp_BankCode
            }
        }

        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        res.render('client/pages/checkout/payment-success', {
            pageTitle: "Kết quả thanh toán",
            order: orderInfo
        })
    } else {
        res.render('client/pages/checkout/payment-success', { code: '97' })
    }
}