import path from "path";

/**
 * Format raw body text with paragraphs and line breaks while keeping HTML tags like <b>, <strong>, <a>
 */
export function formatBodyHtml(bodyText) {
  if (!bodyText) return "";

  // Split into paragraphs by blank lines
  return bodyText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #2d3748; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;">${p.replace(
          /\n/g,
          "<br/>"
        )}</p>`
    )
    .join("");
}

/**
 * Generates the full HTML email matching the design specification:
 * - Header background using public/images/header-bg.jpg
 * - Subject and company name overlay
 * - Dynamic body content
 * - Stylized 2-column signature card
 * - Action cards for Resume & Portfolio
 */
export function generateEmailHtml({
  subject = "Application for Full Stack Developer Position",
  body = "",
  companyName = "",
  role = "Full Stack Developer",
  yourName = "Suraj Sangale",
}) {
  const displayCompany =
    companyName ||
    subject.match(/at\s+([A-Za-z0-9._\- ]+)/i)?.[1]?.trim() ||
    "";
  const displayRole = role || "Full-Stack Developer";
  const displayName = yourName || "Suraj Sangale";
  const formattedBody = formatBodyHtml(body);

  const headerImageUrl = "https://surajsangale.vercel.app/images/header-bg.jpg";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f3ee; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f3ee; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); border: 1px solid #ebdcd0;">
          
          <!-- Header with background-image and subject overlay -->
          <tr>
            <td background="${headerImageUrl}" style="padding: 0; background-color: #faefe7; background-image: url('${headerImageUrl}'); background-image: url('cid:headerbg'); background-size: cover; background-position: right center; background-repeat: no-repeat;">
              <!--[if gte mso 9]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:620px;height:210px;">
              <v:fill type="frame" src="${headerImageUrl}" color="#faefe7" />
              <v:textbox inset="0,0,0,0">
              <![endif]-->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="min-height: 200px;">
                <tr>
                  <td style="padding: 0px 5px 35px 64px; width: 62%; vertical-align: middle;">
                    <div style="font-size: 7px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #c24b27; margin-bottom: 8px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
                      FROM ${displayName.toUpperCase()}
                    </div>
                    <h1 style="margin: 0 0 6px; font-size: 17px; font-weight: 800; color: #111827; line-height: 1.25; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; letter-spacing: -0.02em;">
                      ${subject}
                    </h1>
                    ${
                      displayCompany
                        ? `<div style="font-size: 12px; font-weight: 600; color: #4b5563; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
                            At <span style="color: #c24b27; font-weight: 700;">${displayCompany}</span>
                          </div>`
                        : ""
                    }
                  </td>
                  <td style="width: 38%;">&nbsp;</td>
                </tr>
              </table>
              <!--[if gte mso 9]>
              </v:textbox>
              </v:rect>
              <![endif]-->
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 32px 32px 28px;">
              ${formattedBody}

              <!-- Signature Box (Profile Card) -->
              <div style="background-color: #fbf5ef; border: 1px solid #f3e6d8; border-radius: 14px; padding: 18px 20px; margin: 28px 0 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <!-- Left: Profile & Tech Stack -->
                    <td valign="middle" style="width: 50%; padding-right: 14px;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="middle" style="width: 46px; padding-right: 12px;">
                            <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #c24b27 0%, #de6537 100%); text-align: center; line-height: 44px; color: #ffffff; font-weight: 700; font-size: 19px;">
                              ${displayName.charAt(0) || "S"}
                            </div>
                          </td>
                          <td valign="middle">
                            <div style="font-size: 16px; font-weight: 700; color: #111827; line-height: 1.2;">${displayName}</div>
                            <div style="font-size: 12.5px; font-weight: 600; color: #c24b27; margin-top: 3px;">${displayRole}</div>
                          </td>
                        </tr>
                      </table>
                      <div style="margin-top: 12px;">
                        <span style="display: inline-block; background-color: #f1e3d6; color: #5d4b3e; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 5px; margin-right: 4px; margin-bottom: 4px;">React.js</span>
                        <span style="display: inline-block; background-color: #f1e3d6; color: #5d4b3e; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 5px; margin-right: 4px; margin-bottom: 4px;">Next.js</span>
                        <span style="display: inline-block; background-color: #f1e3d6; color: #5d4b3e; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 5px; margin-right: 4px; margin-bottom: 4px;">Node.js</span>
                        <span style="display: inline-block; background-color: #f1e3d6; color: #5d4b3e; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 5px; margin-bottom: 4px;">AWS</span>
                      </div>
                    </td>

                    <!-- Divider -->
                    <td style="width: 1px; background-color: #e8d9cc; padding: 0;"></td>

                    <!-- Right: Contact Details -->
                    <td valign="middle" style="width: 50%; padding-left: 18px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12.5px; color: #374151;">
                        <tr>
                          <td style="padding: 3px 0;">
                            <a href="tel:+917039529129" style="color: #374151; text-decoration: none; font-weight: 500;">
                              <span style="color: #c24b27; margin-right: 6px;">📞</span> +91 70395 29129
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 3px 0;">
                            <a href="mailto:surajdsangale@gmail.com" style="color: #374151; text-decoration: none; font-weight: 500;">
                              <span style="color: #c24b27; margin-right: 6px;">✉</span> surajdsangale@gmail.com
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 3px 0;">
                            <a href="https://surajsangale.vercel.app/" target="_blank" style="color: #374151; text-decoration: none; font-weight: 500;">
                              <span style="color: #2563eb; margin-right: 6px;">🌐</span> surajsangale.vercel.app
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 3px 0;">
                            <a href="https://www.linkedin.com/in/suraj-sangale/" target="_blank" style="color: #374151; text-decoration: none; font-weight: 500;">
                              <span style="color: #0077b5; margin-right: 6px;">in</span> linkedin.com/in/suraj-sangale
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Action Cards: Resume & Portfolio -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 14px;">
                <tr>
                  <!-- Resume Card -->
                  <td style="width: 50%; padding-right: 7px;">
                    <a href="https://surajsangale.vercel.app/Suraj_full_stack_developer.pdf" target="_blank" style="text-decoration: none; display: block; background-color: #fdf2ee; border: 1px solid #fae0d4; border-radius: 12px; padding: 12px 14px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="width: 34px; vertical-align: middle;">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background-color: #f8ded4; text-align: center; line-height: 32px; font-size: 15px;">
                              📄
                            </div>
                          </td>
                          <td style="vertical-align: middle; padding-left: 10px;">
                            <div style="font-size: 13px; font-weight: 700; color: #111827; line-height: 1.2;">Resume</div>
                            <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">suraj-sangale-resume.pdf</div>
                          </td>
                          <td style="width: 24px; text-align: right; vertical-align: middle;">
                            <span style="font-size: 15px; color: #c24b27;">📥</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>

                  <!-- Portfolio Card -->
                  <td style="width: 50%; padding-left: 7px;">
                    <a href="https://surajsangale.vercel.app" target="_blank" style="text-decoration: none; display: block; background-color: #f0f7ff; border: 1px solid #d9ebff; border-radius: 12px; padding: 12px 14px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="width: 34px; vertical-align: middle;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #0070f3; text-align: center; line-height: 32px; font-size: 13px; color: #ffffff;">
                              🔗
                            </div>
                          </td>
                          <td style="vertical-align: middle; padding-left: 10px;">
                            <div style="font-size: 13px; font-weight: 700; color: #111827; line-height: 1.2;">Portfolio</div>
                            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">surajsangale.vercel.app</div>
                          </td>
                          <td style="width: 24px; text-align: right; vertical-align: middle;">
                            <span style="font-size: 14px; color: #0070f3;">↗</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Returns the attachments array for Nodemailer including resume and header background CID
 */
export function getEmailAttachments() {
  const attachments = [];

  const resumePath = path.join(process.cwd(), "public", "Suraj_full_stack_developer.pdf");
  attachments.push({
    filename: "Suraj_Sangale_Resume.pdf",
    path: resumePath,
    contentType: "application/pdf",
  });

  const headerBgPath = path.join(process.cwd(), "public", "images", "header-bg.jpg");
  attachments.push({
    filename: "header-bg.jpg",
    path: headerBgPath,
    cid: "headerbg",
    contentType: "image/jpeg",
  });

  return attachments;
}
