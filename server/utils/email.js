const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },

    // FOR GMAIL
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
    // But gmail is not a good option for a production app, since after a certain
    // amount of mails your email will be flagged as spam
    // Activate in gmail "less secure app" option
  });

  // 2) Define email options
  const mailOptions = {
    from: 'Auragram <hello@auragram.com>',
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
