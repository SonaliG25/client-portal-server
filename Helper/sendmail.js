// // Import nodemailer
// import nodemailer from "nodemailer";

// // Configure the transporter
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465, // using secure true for port 465
//   secure: true, // true for port 465, false for port 587
//   auth: {
//     user: "sohilvaghela7863@gmail.com",
//     pass: "lwdmzalicreaqqer", // App password generated for Gmail
//   },
// });

// // Function to send email
// async function sendmail(to, subject, text, html) {
//   try {
//     const info = await transporter.sendMail({
//       from: "sohilvaghela7863@gmail.com", // sender address
//       to,
//       subject,
//       text,
//       html,
//       attachments: [
//         {
//           // Provide path to the file
//           filename: "photo", // The file name to show in the email
//           path: "./file/sohil.txt", // Path to the file (e.g., "./files/example.pdf")
//         },
//       ],
//     });
//     console.log("Message sent: %s", info.messageId); // Log the sent message ID
//   } catch (error) {
//     console.error("Error sending email:", error.message); // Log any email errors
//   }
// }

// export { sendmail };
// Import nodemailer
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

// Function to send email
async function sendmail(to, subject, html, attachments) {
  // text, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_ID, // sender address (should match Hostinger email)
      to,
      subject,
      // text,
      html,
      attachments: attachments,
    });
    console.log("Message sent: %s", info.messageId); // Log the sent message ID
  } catch (error) {
    console.error("Error sending email:", error.message); // Log any email errors
  }
}

export { sendmail };
