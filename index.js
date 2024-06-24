const express = require("express");

require('dotenv').config()

const systemConfig = require("./config/system");

// Use http get, put, post, patch, delete
var methodOverride = require('method-override')

// Use to convert object in input(name : value)
var bodyParser = require('body-parser')
// Show message in node
var flash = require('express-flash')
const cookieParser = require("cookie-parser")
const session = require("express-session");

const app = express();

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('dfndsadksfjj'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

const port = process.env.PORT;

// Views
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// public folder
app.use(express.static(`${__dirname}/public`));

// router client
const router = require("./routes/client/index.route");
router(app);

// router admin
const routerAdmin = require("./routes/admin/index.route");
routerAdmin(app);

// database;
const database = require("./config/database");
database.connect();
app.locals.prefixAdmin = systemConfig.prefixAdmin;


app.listen(port, () => {
    console.log("Express connect success !");
})


// Hiện tai ht tiếp diễn vẫn có thể tiếp diễn ở lai
// Quá khư ht tiếp diễn có thể tiếp tục xảy ra ở trong quá khư k '
console.log(__dirname);