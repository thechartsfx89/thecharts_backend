const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::webinar.webinar', ({ strapi }) => ({
  async zohoWebhook(ctx) {
    try {
      const data = ctx.request.body;

      // Optional: verify secret token
      const secret = ctx.request.headers['authorization'];
      if (secret !== `Bearer ${process.env.ZOHO_SECRET}`) {
        return ctx.unauthorized('Invalid secret');
      }

      // Example: create webinar/meeting in Strapi
      const entry = await strapi.db.query('api::webinar.webinar').create({
        data: {
          zoho_id: data.webinar?.id || data.meeting?.id,
          title: data.webinar?.topic || data.meeting?.topic,
          start_time: data.webinar?.start_time || data.meeting?.start_time,
          duration: data.webinar?.duration || data.meeting?.duration,
          type: data.event.includes('webinar') ? 'webinar' : 'meeting',
        },
      });

      return ctx.send({ status: 'ok', entry });
    } catch (err) {
      console.error(err);
      return ctx.internalServerError('Something went wrong');
    }
  },
}));
