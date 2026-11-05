import { Context } from 'koa';
import payment from '../../payment/controllers/payment';

export default {
   async paymentSubmitted(ctx: Context) {
    // const user = ctx.state.user;
    const { courseName, amount, transactionId, email, fullName, payment_mode, currency } = ctx.request.body;
    console.log({ courseName, amount, transactionId, email, fullName, payment_mode }, ">>>>>>>>>>>>>", ctx.request.body)
    // if (!user || !user.email) {
    //   return ctx.badRequest('User not authenticated');
    // }

    await strapi
      .service('api::notifications.notifications')
      .sendPaymentSubmittedEmail({
        to: email,
        fullName,
        courseName,
        amount,
        transactionId,
        payment_mode,
        currency
      });

    return ctx.send({
      message: 'Payment success email sent',
    });
  },

  async paymentSuccess(ctx: Context) {
    // const user = ctx.state.user;
    const { courseName, amount, transactionId, email, name } = ctx.request.body;

    // if (!user || !user.email) {
    //   return ctx.badRequest('User not authenticated');
    // }

    await strapi
      .service('api::notifications.notifications')
      .sendPaymentSuccessEmail({
        to: email,
        fullName: name,
        courseName,
        amount,
        transactionId,
      });

    return ctx.send({
      message: 'Payment success email sent',
    });
  },

  async bookDemo(ctx: Context) {
    const user = ctx.state.user;
    const { courseName, demoDate, email } = ctx.request.body;
     console.log({user}, ">>>>>>>>>", courseName , demoDate)
    // if (!user || !user.email) {
    //   return ctx.badRequest('User not authenticated');
    // }

    await strapi
      .service('api::notifications.notifications')
      .sendBookDemoEmail({
        to: email,
        // fullName: user.fullName || user.username,
        courseName,
        demoDate,
      });

    return ctx.send({
      message: 'Book demo email sent',
    });
  },
};
