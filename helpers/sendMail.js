const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "ngocdev160304@gmail.com",
          pass: "bikl eauv gegw ceey",
        },
    });
    const mailOptions = {
        from: "ngocdev160304@gmail.com",
        to: email,
        subject: subject,
        text: text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
    });
}