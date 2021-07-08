const nodemailer = require("nodemailer");

module.exports.processMail = async function (settings) {
    // settings is a object that should have this fields
    // receivers, // list of receivers as a commma separated string of addresses
    // subjectText, // Subject line string
    // plainTextEmail, // plain text body
    // settings.htmlBodyEmail // body formatted as html

    // Generate test SMTP service account from ethereal.email
    // just for test purposes
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transport object using SMTP transport
    let transport = nodemailer.createTransport({
        host: "smtp.ethereal.email", // must change
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transport.sendMail({
        from: '"Chat APP" <noreply@chat.com>', // sender address
        to: settings.receivers, // list of receivers as a string of addresses commma separated
        subject: settings.subjectText, // Subject line
        text: settings.plainTextEmail, // plain text body
        html: settings.htmlBodyEmail, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    console.log(`info object:${info}`)
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

