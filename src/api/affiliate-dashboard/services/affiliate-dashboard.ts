/**
 * affiliate-dashboard service
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreService('api::affiliate-dashboard.affiliate-dashboard');

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::affiliate-dashboard.affiliate-dashboard',
  ({ strapi }) => ({
    async getStats() {
      const knex = strapi.db.connection;

      // ✅ total students (users)
      const [{ count: total_students }] = await knex('up_users')
        .count('* as count');

      // ✅ total teachers
      const [{ count: total_teachers }] = await knex('teachers')
        .count('* as count');

      // ✅ total courses
      const [{ count: total_courses }] = await knex('recorderd_lectures')
        .count('* as count');

      // ✅ enrolled courses
      const [{ count: enrolled_courses }] = await knex('purchased_courses')
        .count('* as count');

      return {
        total_students: Number(total_students),
        total_teachers: Number(total_teachers),
        total_courses: Number(total_courses),
        enrolled_courses: Number(enrolled_courses),
      };
    },
  })
);

