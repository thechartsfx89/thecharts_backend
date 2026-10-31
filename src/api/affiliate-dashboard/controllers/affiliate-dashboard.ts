/**
 * affiliate-dashboard controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::affiliate-dashboard.affiliate-dashboard');

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::affiliate-dashboard.affiliate-dashboard',
  ({ strapi }) => ({
    async stats(ctx) {
      try {
        const data = await strapi
          .service('api::affiliate-dashboard.affiliate-dashboard')
          .getStats();

        ctx.send({
          status: true,
          data,
        });
      } catch (error) {
        ctx.throw(500, error);
      }
    },
  })
);

