/**
 * affiliate-dashboard router
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::affiliate-dashboard.affiliate-dashboard');

export default {
  routes: [
    {
      method: 'GET',
      path: '/affiliate/dashboard',
      handler: 'affiliate-dashboard.stats',
      config: {
        auth: false, // true if you want JWT auth
      },
    },
  ],
};

