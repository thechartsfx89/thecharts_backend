// export default () => ({});
import path from 'path';
import os from 'os';
// config/plugins.ts
export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.hostinger.com', // Change this from smtp.gmail.com
        port: 465,                  // Keep 465 for SSL
        secure: true,               // Use SSL
        auth: {
          user: env('EMAIL_USER'),  // This should be hello@educandle.com
          pass: env('EMAIL_PASS'),  // Use the password created in Hostinger panel
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'hello@educandle.com'),
        defaultReplyTo: env('EMAIL_REPLYTO', 'hello@educandle.com'),
      },
    },
  },

  "users-permissions": {
    config: {
      register: {
        allowedFields: ["id", "firstName", "lastName", "gender", "dob", "country", "mobileNumber", "role", "fullName", "username", "referralBy", "referralByCode", "ownReferralCode", "referralName", "affiliate_expiredAt", "first_password", "referredBy"],
      },
    },
  },
});

