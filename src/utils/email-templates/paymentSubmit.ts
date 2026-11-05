import { formatMoney } from "../format-money";

export const paymentSubmitTemplate = (
   fullName:any, transactionId:any, amount:any, courseName:any, payment_mode:any, currency?:any
) => ({
  subject: `Payment Submitted - Transaction ID: ${transactionId}`,
  html: `
  <!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Payment Confirmation</title>

  <style>
    body,
    table,
    td,
    a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      outline: none;
      text-decoration: none;
      display: block;
    }

    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background: #eef1f7;
      font-family: 'Segoe UI', Arial, sans-serif;
    }

    /* WRAPPER */
    .wrapper {
      width: 100%;
      padding: 24px 12px;
    }

    /* MAIN CARD */
    .container {
      max-width: 620px;
      margin: auto;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      border: 1px solid #e5e7eb;
    }

    /* HEADER */
    .header {
      padding: 28px 22px;
      text-align: center;
      color: #ffffff;
      background: linear-gradient(135deg, #5f2eea, #9333ea, #ec4899);
    }

    .logo {
      width: 110px;
      margin: 0 auto 12px;
      border-radius: 14px;
      background: #ffffff;
      padding: 6px;
    }

    .title {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .subtitle {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.9;
    }

    /* BODY */
    .body {
      padding: 28px 28px;
      color: #374151;
      line-height: 1.6;
    }

    .body h3 {
      margin: 0 0 12px;
      font-size: 20px;
      color: #111827;
    }

    .body p {
      font-size: 14px;
      color: #4b5563;
      margin: 0 0 14px;
    }

    /* INFO BOX */
    .notice {
      background: linear-gradient(135deg, #fdf2ff, #eef2ff);
      border: 1px solid #e9d5ff;
      border-radius: 14px;
      padding: 16px;
      margin: 18px 0;
      font-size: 14px;
      color: #374151;
    }

    /* BUTTON */
    .button {
      display: inline-block;
      margin: 18px 0;
      padding: 12px 24px;
      background: linear-gradient(135deg, #5f2eea, #9333ea);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 14px;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 8px 18px rgba(147, 51, 234, 0.35);
    }

    /* FOOTER */
    .footer {
      padding: 18px 22px;
      text-align: center;
      font-size: 13px;
      color: #9ca3af;
      background: #fafafa;
      border-top: 1px solid #eeeeee;
    }

    .footer a {
      color: #7c3aed;
      text-decoration: none;
      font-weight: 600;
    }

    .brand-img {
      width: 170px;
      height: auto;
      margin: 0 auto 12px;
      border-radius: 8px;
      object-fit: cover;
    }

    /* MOBILE */
    @media (max-width:480px) {
      .body {
        padding: 22px 18px;
      }

      .title {
        font-size: 18px;
      }
      .subtitle{
        font-size: 13px;
      }

      .brand-img {
        width: 140px;
      }

      .button {
        padding: 11px 22px;
        font-size: 12px;
      }
    }
  </style>
</head>

<body>

  <table width="100%" cellpadding="0" cellspacing="0" class="wrapper">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" class="container">

          <!-- HEADER -->
          <tr>
            <td class="header">
              <img src="https://api.educandle.com/uploads/Screenshot_2025_12_12_at_5_28_19_PM_removebg_preview_1_b3b79eb32e.png"
                alt="EduCandle" class="brand-img" />
              <h2 class="title">Thank You for Your Payment!</h2>
              <div class="subtitle">We’ve received your payment details successfully.</div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td class="body">
              <h4>Hello ${fullName ?? "Student"} </h4>

              <p>
                Thank you for your payment. We truly appreciate your trust in EduCandle.
              </p>
               <!-- PAYMENT DETAILS -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
  <tr>
    <td style="padding:14px 16px; background:#f9fafb; font-weight:600; color:#111827; font-size:14px;">
      Payment Details
    </td>
  </tr>
  <tr>
    <td style="padding:14px 16px; font-size:14px; color:#374151;">
      <p style="margin:6px 0;"><strong>Course Name:</strong> ${courseName ?? ""} </p>
      <p style="margin:6px 0;"><strong>Payment Amount:</strong> ${formatMoney(amount, currency)} </p>
      <p style="margin:6px 0;"><strong>Payment Mode:</strong> ${payment_mode ?? ""} </p>
      <p style="margin:6px 0;"><strong>Transaction ID:</strong> ${transactionId ?? ""} </p>
      <p style="margin:6px 0;"><strong>Payment Status:</strong> Under Verification</p>

    </td>
  </tr>
</table>
              <div class="notice">
                Our verification process is currently in progress and may take up to <b>24 hours</b>.
                Once approved, your course will instantly appear in your dashboard.
              </div>

              <a href="https://educandle.com" class="button">
                Access Dashboard
              </a>

              <p style="margin-top:18px">
                If you have any questions or need help, our support team is always available.
              </p>

              <p style="margin-top:18px; font-weight:500; color:#111827;">
                <span>EduCandle</span><br/>
                <span>Support Team</span>

              </p>
              

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer">
              © 2025 EduCandle. All rights reserved.<br><br>
              Need help?
              <a href="mailto:info@educandle.com">info@educandle.com</a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>

</html>
  `
});
