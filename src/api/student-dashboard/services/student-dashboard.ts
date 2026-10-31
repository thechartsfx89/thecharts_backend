/**
 * student-dashboard service
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreService('api::student-dashboard.student-dashboard');
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::student-dashboard.student-dashboard',
  ({ strapi }) => ({
   // src/api/student-dashboard/services/student-dashboard.js
async getStats(userId) {
  // Use Strapi's built-in DB Query - it handles link table names automatically
  const uid = Number(userId);

  // 1. Let Strapi handle the 'purchased_courses_user_lnk' join automatically
  const enrolled_courses = await strapi.db.query('api::purchased-course.purchased-course').count({
    where: {
      user: uid,
    },
  });
  console.log('Enrolled courses count:', userId,enrolled_courses);
  const knex = strapi.db.connection;

  // Global counts (these table names usually match pluralName)
  const [{ count: total_students }] = await knex('up_users').count('* as count');
  const [{ count: total_teachers }] = await knex('teachers').count('* as count');
  const [{ count: total_courses }] = await knex('recorderd_lectures').count('* as count');

  // Wallet - also using Strapi DB Query to avoid link table naming issues
//   const wallet = await strapi.db.query('api::wallet.wallet').findOne({
//     where: { user: userId },
//     select: ['balance']
//   });

  return {
    total_students: Number(total_students),
    total_teachers: Number(total_teachers),
    total_courses: Number(total_courses),
    enrolled_courses: Number(enrolled_courses),
    // wallet_balance: wallet ? Number(wallet.balance) : 0,
  };
}
  })
);
