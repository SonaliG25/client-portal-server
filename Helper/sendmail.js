import nodemailer from "nodemailer";
import "dotenv/config";
// Configure the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Hostinger SMTP server
  port: 465, // Port for secure connection
  secure: true, // true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_ID, // Your Hostinger email address
    pass: process.env.EMAIL_PASSWORD, // Your Hostinger email password
  },
});

async function sendEmail(proposalData) {
  const mailOptions = {
    from: process.env.EMAIL_ID, // Sender address
    to: proposalData.emailTo, // Recipient address
    subject: proposalData.title, // Subject line
    html: proposalData.content, // HTML body content
    attachments: proposalData.attachments.map((file) => ({
      filename: file.filename,
      path: file.path,
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("attachments", mailOptions.attachments);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export { sendEmail };
