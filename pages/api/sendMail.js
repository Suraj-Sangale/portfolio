// pages/api/sendMail.js
import nodemailer from "nodemailer";
import { generateEmailHtml, getEmailAttachments } from "../../lib/generateEmailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Support both template email sender payload and portfolio contact form payload
  const {
    to,
    from_name,
    from_email,
    subject,
    body,
    message,
    companyName,
    role,
    yourName,
  } = req.body;

  const mailUser = (process.env.MAIL_USER || "").trim();
  const mailPass = (process.env.MAIL_PASS || process.env.MY_EMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

  if (!mailUser || !mailPass) {
    return res.status(500).json({
      status: false,
      message: "Server configuration error: MAIL_USER or MAIL_PASS environment variables are missing on Vercel.",
    });
  }

  const targetTo = to || mailUser;
  const emailSubject = subject || "Application for Full Stack Developer Position";
  const emailContent = body || message || "";
  const senderName = yourName || from_name || "Suraj Sangale";

  if (!emailSubject || !emailContent) {
    return res.status(400).json({
      status: false,
      message: "Subject and email body/message are required.",
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
    subject: emailSubject,
    body: emailContent,
    companyName: companyName || "",
    role: role || "Full Stack Developer",
    yourName: senderName,
  });

  const mailOptions = {
    from: `"${senderName}" <${mailUser}>`,
    to: targetTo,
    ...(from_email ? { replyTo: from_email } : {}),
    subject: emailSubject,
    text: emailContent.replace(/<[^>]+>/g, ""),
    attachments: getEmailAttachments(),
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      status: true,
      message: `Email sent successfully to ${targetTo}`,
    });
  } catch (err) {
    console.error("[sendMail] error:", err);
    return res.status(500).json({
      status: false,
      message: `Failed to send email: ${err.message || "Please check server logs."}`,
    });
  }
}
