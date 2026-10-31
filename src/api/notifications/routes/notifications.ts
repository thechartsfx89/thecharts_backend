export default {
  routes: [
    {
      method: 'POST',
      path: '/notifications/payment-submitted',
      handler: 'notifications.paymentSubmitted',
      config: {
        auth: false, // set true if you want JWT auth
      },
    },
    {
      method: 'POST',
      path: '/notifications/payment-success',
      handler: 'notifications.paymentSuccess',
      config: {
        auth: false, // set true if you want JWT auth
      },
    },
    {
      method: 'POST',
      path: '/notifications/book-demo',
      handler: 'notifications.bookDemo',
      config: {
        auth: false,
      },
    },
    // {
    //   method: 'POST',
    //   path: '/notifications/affiliate-welcome',
    //   handler: 'notifications.affiliateWelcome',
    //   config: {
    //     auth: false,
    //   },
    // },
    // {
    //   method: 'POST',
    //   path: '/notifications/club-welcome',
    //   handler: 'notifications.clubWelcome',
    //   config: {
    //     auth: false,
    //   },
    // },
    // {
    //   method: 'POST',
    //   path: '/notifications/register-welcome',
    //   handler: 'notifications.registerWelcome',
    //   config: {
    //     auth: false,
    //   },
    // },
    // {
    //   method: 'POST',
    //   path: '/notifications/commission-transaction',
    //   handler: 'notifications.commissionTransaction',
    //   config: {
    //     auth: false,
    //   },
    // },
    // {
    //   method: 'POST',
    //   path: '/notifications/commission-transaction',
    //   handler: 'notifications.affiliateEnrollReminder',
    //   config: {
    //     auth: false,
    //   },
    // },
    // {
    //   method: 'POST',
    //   path: '/notifications/commission-transaction',
    //   handler: 'notifications.affiliateIndirectIncomeReminder',
    //   config: {
    //     auth: false,
    //   },
    // },
  ],
};
