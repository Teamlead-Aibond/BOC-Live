/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
let nodemailer = require('nodemailer');
require('dotenv').config();
let environment = process.env;

module.exports.GmailTransport = nodemailer.createTransport({
    service: environment.GMAIL_SERVICE_NAME,
    host: environment.GMAIL_SERVICE_HOST,
    secure: environment.GMAIL_SERVICE_SECURE,
    port: environment.GMAIL_SERVICE_PORT,
    auth: {
        user: environment.GMAIL_USER_NAME,
        pass: environment.GMAIL_USER_PASSWORD
    }
});
module.exports.GmailTransportStore = nodemailer.createTransport({
    service: environment.GMAIL_SERVICE_NAME_STORE,
    host: environment.GMAIL_SERVICE_HOST_STORE,
    secure: environment.GMAIL_SERVICE_SECURE_STORE,
    port: environment.GMAIL_SERVICE_PORT_STORE,
    auth: {
        user: environment.GMAIL_USER_NAME_STORE,
        pass: environment.GMAIL_USER_PASSWORD_STORE
    }
});


module.exports.OutlookTransport = nodemailer.createTransport({
    // service: environment.OUTLOOK_SERVICE_NAME,
    // host: environment.OUTLOOK_SERVICE_HOST,
    // secureConnection:environment.OUTLOOK_TLS,
    // port: environment.OUTLOOK_SERVICE_PORT,
    // auth: {
    //     user: environment.OUTLOOK_USER_NAME,
    //     pass: environment.OUTLOOK_USER_PASSWORD
    // }
    // host: "smtp-mail.outlook.com", // hostname
    // host: environment.OUTLOOK_SERVICE_HOST,
    // secureConnection: environment.OUTLOOK_SECURE_CONNECTION, // TLS requires secureConnection to be false
    // port: environment.OUTLOOK_SERVICE_PORT, // port for secure SMTP 993,587
    // auth: {
    //     user: environment.OUTLOOK_USER_NAME,
    //     pass: environment.OUTLOOK_USER_PASSWORD
    // },
    // tls: {
    //     ciphers:'SSLv3'
    // }

    // host: "smtp.office365.com",
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    debug: true,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: "ahstoresupport@ahgroupna.com",
        pass: "Ah$tore@123"
    }
});

module.exports.OutlookBulkTransport = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    debug: true,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: "repairquotes@ahgroupna.com",
        pass: "Rqrq@2023"
    }
});

// var transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com", // hostname
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     tls: {
//        ciphers:'SSLv3'
//     },
//     auth: {
//         user: 'mymail@outlook.com',
//         pass: 'myPassword'
//     }
// });



module.exports.SMTPTransport = nodemailer.createTransport({
    host: environment.SMTP_SERVICE_HOST,
    port: environment.SMTP_SERVICE_PORT,
    secure: environment.SMTP_SERVICE_SECURE, // upgrade later with STARTTLS
    debug: true,
    auth: {
        user: environment.SMTP_USER_NAME,
        pass: environment.SMTP_USER_PASSWORD
    }
});

module.exports.ViewOption = (transport, hbs) => {
    transport.use('compile', hbs({
        viewPath: 'views/email',
        extName: '.hbs'
    }));
}