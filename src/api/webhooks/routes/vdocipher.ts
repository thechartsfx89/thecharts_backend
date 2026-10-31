module.exports = {
  routes: [
    {
      method: "POST",
      path: "/webhooks/vdocipher",
      handler: "vdocipher.receive",
      config: {
        auth: false, // webhook must be public
      },
    },
  ],
};
