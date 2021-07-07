const nodemailer = require('nodemailer');

async function sendEmail(settings){
    // settings: {email, subject, message}
    const transport  = nodemailer.createTransport({
        // if  service: 'Gmail',//must activate less secure apps access....
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'rlothbrock <rlothbrock.10@gmail.com>',
        to: settings.email,
        subject: settings.subject,
        text: settings.message
        // ,html: ??
    }

    await transport.sendMail(mailOptions);
}

module.exports.sendEmail = sendEmail
