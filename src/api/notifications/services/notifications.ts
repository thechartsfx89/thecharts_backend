import { paymentSubmitTemplate } from "../../../utils/email-templates/paymentSubmit";

export default {


  async sendPaymentSubmittedEmail({
    to,
    fullName,
    courseName,
    amount,
    transactionId,
    payment_mode
  }) {
    
    const template = paymentSubmitTemplate(
      fullName,
      transactionId,
      amount,
      courseName,
      payment_mode
    );

    await strapi.plugin('email').service('email').send({
      to,
      subject: template.subject,
      html: template.html,
    });
  },

  async sendPaymentSuccessEmail({
    to,
    fullName,
    courseName,
    amount,
    transactionId,
  }) {
    await strapi.plugin('email').service('email').send({
      to,
      subject: 'Payment Successful 🎉',
      html: `
        <h2>Hello ${fullName},</h2>
        <p>Your payment was successful.</p>

        <p><strong>Course:</strong> ${courseName}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>

        <p>Thank you for choosing Educandle.</p>
      `,
    });
  },

  async sendBookDemoEmail({
    to,
    fullName = "Anil",
    courseName,
    demoDate,
  }) {
    await strapi.plugin('email').service('email').send({
      to,
      subject: 'Demo Session Booked 📅',
      html: `
        <p>Hi there,</p>
        <p>Your demo session has been booked successfully.</p>

        <p><strong>Course:</strong> ${courseName}</p>
        <p><strong>Date:</strong> ${demoDate}</p>

        <p>Our team will contact you shortly.</p>
      `,
    });
  },
};
