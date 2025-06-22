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
    subject,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2 style="color: #007bff;">New Contact Message</h2>

  <p>
    <strong>Name:</strong> ${from_name}<br />
    <strong>Email:</strong> <a href="mailto:${from_email}">${from_email}</a>
  </p>

  <hr style="margin: 20px 0;" />

  <p style="line-height: 1.6;">
    <strong>Message:</strong><br />
    ${message}
  </p>

  <br />
  <p style="font-size: 0.9em; color: #777;">
    This message was sent from your portfolio contact form.
  </p>
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
