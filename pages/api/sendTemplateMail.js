// pages/api/sendTemplateMail.js
import nodemailer from "nodemailer";
import { generateEmailHtml, getEmailAttachments } from "../../lib/generateEmailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, body, companyName, role, yourName } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ status: false, message: "to, subject, and body are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const html = generateEmailHtml({
    subject,
    body,
    companyName,
    role,
    yourName,
  });

  const mailOptions = {
    from: `"${yourName || "Suraj Sangale"}" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text: body.replace(/<[^>]+>/g, ""),
    attachments: getEmailAttachments(),
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ status: true, message: "Email sent successfully to " + to });
  } catch (err) {
    console.error("[sendTemplateMail] error:", err);
    return res.status(500).json({ status: false, message: "Failed to send email. Please try again." });
  }
}
