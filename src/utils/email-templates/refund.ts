import { formatMoney } from "../format-money";

export const refundTemplate = (
  name: string,
  refundId: string,
  amount: number,
  courseName: string,
  currency?: string | null
) => ({
  subject: `Refund Request Received - Ref ID: ${refundId}`,
  html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Refund Request Received</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; display: block; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; -webkit-font-smoothing: antialiased; background-color: #f4f6f8; }

    .email-wrap { width: 100%; background: #f4f6f8; padding: 32px 12px; box-sizing: border-box; }
    .email-inner { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 24px rgba(16,24,40,0.08); }

    .email-header { padding: 28px 32px; background: linear-gradient(90deg, #0ea5a4 0%, #34d399 100%); color: #fff; text-align: center; }
    .brand-img { width: 140px; height: auto; margin: 0 auto 12px; border-radius: 8px; display: block; object-fit: cover; }

    .header-title { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.2px; }
    .header-sub { margin: 6px 0 0; font-size: 14px; opacity: 0.95; }

    .email-body { padding: 32px; color: #112; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; line-height: 1.5; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    p { margin: 0 0 16px; color: #374151; font-size: 15px; }

    .details-box {
      background: #f9fafb;
      padding: 18px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      margin: 20px 0;
    }
    .detail-row { margin: 6px 0; font-size: 15px; }

    .email-footer { padding: 20px 24px; font-size: 13px; color: #9ca3af; text-align: center; background: #fafafa; }

    @media (max-width: 480px) {
      .email-body { padding: 20px; }
      .email-header { padding: 20px; }
      .brand-img { width: 120px; }
      h1 { font-size: 18px; }
    }
  </style>
</head>

<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-wrap">
    <tr>
      <td align="center">
        <table role="presentation" class="email-inner" cellpadding="0" cellspacing="0" width="100%">

          <!-- Header -->
          <tr>
            <td class="email-header">
              <img src="https://ik.imagekit.io/23bpetfad/Screenshot_2025-12-12_at_5.04.58_PM-removebg-preview.png" alt="Brand" class="brand-img" />
              <h2 class="header-title">Refund Request Received</h2>
              <div class="header-sub">We're reviewing your request</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body">
              <h1>Hello, ${name}</h1>

              <p>Your refund request has been successfully received. Our team will review it and get back to you shortly.</p>

              <div class="details-box">
                <div class="detail-row"><strong>Refund ID:</strong> ${refundId}</div>
                <div class="detail-row"><strong>Amount:</strong> ${formatMoney(amount, currency)}</div>
                <div class="detail-row"><strong>Course:</strong> ${courseName}</div>
              </div>

              <p>If we need any additional information, our support team will reach out to you.</p>

              <p style="margin-top:20px; font-weight:600; color:#111827;">
                Thanks & Regards,<br/>
                The Charts Support Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="email-footer">
              © 2025. The Charts. All rights reserved.<br/>
              <span style="display:block; margin-top:6px;">For support, contact <a href="mailto:thechartsfx89@gmail.com" style="color:#10b981; text-decoration:none;">info@thechartsfx.com</a></span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
});
