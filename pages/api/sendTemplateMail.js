// pages/api/sendTemplateMail.js
import nodemailer from "nodemailer";
import { generateEmailHtml, getEmailAttachments } from "../../lib/generateEmailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, body, companyName, role, yourName } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ status: false, message: "to, subject, and body are required." });
  }

  const mailUser = (process.env.MAIL_USER || "").trim();
  const mailPass = (process.env.MAIL_PASS || process.env.MY_EMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

  if (!mailUser || !mailPass) {
    return res.status(500).json({
      status: false,
      message: "Server configuration error: MAIL_USER or MAIL_PASS environment variables are missing on Vercel.",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailUser,
      pass: mailPass,
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
    from: `"${yourName || "Suraj Sangale"}" <${mailUser}>`,
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
    return res.status(500).json({
      status: false,
      message: `Failed to send email: ${err.message || "Please check server logs."}`,
    });
  }
}
