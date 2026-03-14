import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLeadNotification(data: {
  name: string;
  email: string;
  phone?: string;
  package_interest?: string;
  travel_date?: string;
  trip_type?: string;
  num_adults?: number;
  num_children?: number;
  budget?: string;
  notes?: string;
}) {
  const to = process.env.NOTIFY_EMAIL || "admin@infygru.com";

  const rows = [
    ["Name",             data.name],
    ["Email",            data.email],
    ["Phone",            data.phone        || "—"],
    ["Package Interest", data.package_interest || "—"],
    ["Travel Date",      data.travel_date   || "—"],
    ["Trip Type",        data.trip_type     || "—"],
    ["Adults",           data.num_adults    ?? "—"],
    ["Children",         data.num_children  ?? "—"],
    ["Budget",           data.budget        || "—"],
    ["Notes",            data.notes         || "—"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#1a120b;background:#fdf6ec;white-space:nowrap;border-bottom:1px solid #ede4d0;">${label}</td>
        <td style="padding:8px 12px;color:#3d2c1e;border-bottom:1px solid #ede4d0;">${value}</td>
      </tr>`,
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#14141a;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#f5dc82;letter-spacing:1px;">IG HOLIDAYS</p>
            <p style="margin:6px 0 0;font-size:13px;color:#a0a0aa;">New Lead Notification</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 20px;font-size:16px;color:#1a120b;font-weight:600;">
              A new enquiry has been submitted.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #ede4d0;">
              ${tableRows}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:#fdf6ec;border-top:1px solid #ede4d0;">
            <p style="margin:0;font-size:11px;color:#a08060;text-align:center;">
              IG Holidays &nbsp;·&nbsp; A Brand of Infygru Private Limited &nbsp;·&nbsp; igholidays.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from:    `"IG Holidays Leads" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Lead: ${data.name} — ${data.package_interest || "General Enquiry"}`,
    html,
  });
}
