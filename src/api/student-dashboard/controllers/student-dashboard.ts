/**
 * student-dashboard controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::student-dashboard.student-dashboard');
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::student-dashboard.student-dashboard',
  ({ strapi }) => ({
    async stats(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('You must be logged in to view stats');
        }

        const data = await strapi
          .service('api::student-dashboard.student-dashboard')
          .getStats(user.id);

        // Strapi convention: return the data directly
        return {
          status: true,
          data,
        };
      } catch (error) {
        ctx.send({ status: false, error: error.message }, 500);
      }
    },
  })
);
