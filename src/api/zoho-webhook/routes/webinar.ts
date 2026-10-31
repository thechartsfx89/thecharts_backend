module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/zoho-webhook',
      handler: 'webinar.zohoWebhook',
      config: {
        auth: false, // webhook should be public
      },
    },
  ],
};
