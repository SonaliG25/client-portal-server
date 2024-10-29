// Import nodemailer
import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  secure: true, // true for port 465, false for other ports
  auth: {
    user: "sohilvaghela7863@gmail.com",
    pass: "lwdmzalicreaqqer",
  },
});

// Function to send email
async function sendmail(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: "sohilvaghela7863@gmail.com", // sender address
    to,
    subject,
    text,
    html,
  });
}

export { sendmail };
