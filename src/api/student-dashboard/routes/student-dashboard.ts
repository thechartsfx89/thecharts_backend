/**
 * student-dashboard router
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::student-dashboard.student-dashboard');
export default {
  routes: [
    {
      method: 'GET',
      path: '/student/dashboard',
      handler: 'student-dashboard.stats',
      config: {
        auth: {
          required: false, // Requires JWT to identify the user
        },
      },
    },
  ],
};
