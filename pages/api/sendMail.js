// pages/api/sendMail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { from_name, from_email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: from_email,
    to: process.env.MAIL_USER,
    subject: `📬 New Message from Portfolio - ${subject}`,
    html: `
  <div style="
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f5f7fa;
    padding: 30px;
    color: #333;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    ">
      <div style="background-color: #007bff; padding: 16px 24px; text-align: center;">
        <h2 style="margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 0.5px;">
          💬 New Message from Your Portfolio
        </h2>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 16px; margin-bottom: 10px;">Hey <strong>Suraj</strong>,</p>
        <p style="font-size: 15px; color: #444;">
          You’ve received a new message from your portfolio contact form:
        </p>

        <div style="
          background-color: #f0f3f8;
          padding: 16px 20px;
          border-radius: 8px;
          margin: 20px 0;
        ">
          <p style="margin: 4px 0;">
            <strong style="color: #007bff;">👤 Name:</strong> ${from_name}
          </p>
          <p style="margin: 4px 0;">
            <strong style="color: #007bff;">📧 Email:</strong> 
            <a href="mailto:${from_email}" style="color: #007bff; text-decoration: none;">
              ${from_email}
            </a>
          </p>
          <p style="margin: 4px 0;">
            <strong style="color: #007bff;">📝 Subject:</strong> ${subject}
          </p>
        </div>

        <p style="
          line-height: 1.6;
          background-color: #fafafa;
          padding: 15px 18px;
          border-left: 4px solid #007bff;
          border-radius: 6px;
          white-space: pre-line;
        ">
          ${message}
        </p>

        <p style="font-size: 13px; color: #888; margin-top: 25px;">
          📅 Sent on: ${new Date().toLocaleString()}
        </p>
      </div>

      <div style="
        background-color: #f1f3f5;
        padding: 14px;
        text-align: center;
        font-size: 13px;
        color: #666;
      ">
        <p style="margin: 0;">
          This message was sent from your <strong>Portfolio Contact Form</strong>.<br/>
          <a href="https://surajsangale.vercel.app/" 
             style="color: #007bff; text-decoration: none; font-weight: 500;">
             Visit Portfolio →
          </a>
        </p>
      </div>
    </div>
  </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
