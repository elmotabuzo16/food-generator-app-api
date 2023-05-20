import asyncHandler from 'express-async-handler';
import nodeMailer from 'nodemailer';

export const contactBlogAuthorForm = asyncHandler(async (req, res) => {
  const { email, name, message } = req.body;

  // email
  const emailData = {
    from: process.env.EMAIL_FROM, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
    to: process.env.EMAIL_FROM, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
    subject: `Contact Message - From ${email}`,
    html: `
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://ketofoodgenerator.com</p>
    `,
  };

  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_FROM, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      pass: process.env.EMAIL_PW, // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  transporter
    .sendMail(emailData)
    .then((info) => {
      return res.json({
        message: `Your questons or message has been sent. Thank you for contacting us.`,
      });
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
});
