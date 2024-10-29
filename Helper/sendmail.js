// Import nodemailer
import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // using secure true for port 465
  secure: true, // true for port 465, false for port 587
  auth: {
    user: "sohilvaghela7863@gmail.com",
    pass: "lwdmzalicreaqqer", // App password generated for Gmail
  },
});

// Function to send email
async function sendmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: "sohilvaghela7863@gmail.com", // sender address
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId); // Log the sent message ID
  } catch (error) {
    console.error("Error sending email:", error.message); // Log any email errors
  }
}

export { sendmail };
