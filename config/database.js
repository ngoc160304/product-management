const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        console.log("connnect database success");
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log("connect database error")
        console.log(error);
    }
}