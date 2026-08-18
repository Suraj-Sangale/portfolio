// pages/api/sendTemplateMail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, body } = req.body;

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

  const mailOptions = {
    from: `"Suraj Sangale" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text: body,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);">

        <!-- Top accent bar -->
        <tr>
          <td style="height:4px;background:linear-gradient(90deg,#a33a20 0%,#c96a4c 100%);font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="padding:36px 40px 0;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a33a20;font-weight:600;">
              From Suraj Sangale
            </p>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#1a1a1a;line-height:1.3;letter-spacing:-0.01em;">
              ${subject}
            </h1>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:20px 40px 0;">
            <div style="height:1px;background:#ede9e3;font-size:0;line-height:0;">&nbsp;</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0;font-size:15px;line-height:1.75;color:#3a3a3a;white-space:pre-wrap;">${body}</p>
          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:0 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #ede9e3;padding-top:20px;">
              <tr>
                <td>
                  <!-- Name + avatar row -->
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:14px;vertical-align:middle;">
                        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#a33a20,#c96a4c);display:inline-block;font-size:18px;color:#fff;font-weight:700;line-height:44px;text-align:center;">S</div>
                      </td>
                      <td style="vertical-align:middle;">
                        <p style="margin:0;font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.2;">Suraj Sangale</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#a33a20;font-weight:600;letter-spacing:0.01em;">Full-Stack Developer</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Tech stack pill -->
                  <p style="margin:10px 0 0;font-size:11.5px;color:#555;font-weight:500;">
                    React.js &nbsp;•&nbsp; Next.js &nbsp;•&nbsp; Node.js
                  </p>

                  <!-- Divider -->
                  <div style="height:1px;background:#ede9e3;margin:12px 0;"></div>

                  <!-- Contact details -->
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:5px;">
                        <a href="tel:+917039529129" style="font-size:12px;color:#444;text-decoration:none;">
                          📞 +91 70395 29129
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom:5px;">
                        <a href="mailto:surajdsangale@gmail.com" style="font-size:12px;color:#a33a20;text-decoration:none;font-weight:500;">
                          ✉ surajdsangale@gmail.com
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom:5px;">
                        <a href="https://surajsangale.vercel.app/" style="font-size:12px;color:#444;text-decoration:none;">
                          🌐 surajsangale.vercel.app
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="https://www.linkedin.com/in/suraj-sangale/" style="font-size:12px;color:#0077b5;text-decoration:none;font-weight:500;">
                          in linkedin.com/in/suraj-sangale
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Timestamp -->
                  <p style="margin:14px 0 0;font-size:10.5px;color:#bbb;">
                    ${new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>


      </table>
      <!-- /Card -->

    </td></tr>
  </table>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ status: true, message: "Email sent successfully to " + to });
  } catch (err) {
    console.error("[sendTemplateMail] error:", err);
    return res.status(500).json({ status: false, message: "Failed to send email. Please try again." });
  }
}
