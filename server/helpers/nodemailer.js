const nodemailer = require("nodemailer");

function mailer(email, inviter, projectId) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW
    }
  });

  let mailSender = transporter.sendMail({
    from: '"Fancy Todo" <foo@example.com>',
    to: `${email}`,
    subject: "Project Invitation",
    html: `
        <h1>[Fancy Todo] Hi, there!</h1>
        <p>We would like to inform that you are invited to join a project created by 
          ${inviter} in our Fancy Todo App. You are allowed to directly join the project after log in by clicking <a href="http://localhost:3000/projects/${projectId}/acceptInvitation">here</a></p>
        <p>If you think that you are not part of the project, you can reject the invitation.</p>
        <p>Thank you</p>
        `
  })

  return new Promise((resolve, reject) => {
    mailSender
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })

}

module.exports = mailer