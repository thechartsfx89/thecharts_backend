// export default ({ env }) => ({
//   host: env('HOST', '0.0.0.0'),
//   port: env.int('PORT', 1337),
//   app: {
//     keys: env.array('APP_KEYS'),
//   },
// });
module.exports = ({ env }) => ({
  host: "0.0.0.0",
  port: env.int("PORT", 1338),
    url: env('PUBLIC_URL', 'https://api.thechartsfx.com'),
  app: {
    keys: env.array("APP_KEYS"),
  },
  cron: {
    enabled: true,
    tasks: {
      // ✅ every minute
      "0 0 * * *": async ({ strapi }) => {
        try {
          strapi.log.info("⏳ Running affiliate bonus washout job");

          const now = new Date();

          await strapi.db
          .query("plugin::users-permissions.user")
          .updateMany({
            where: {
              affiliate_expired: false,
              confirm_affiliate_payment: false, // ✅ Added your condition
              affiliate_expiredAt: { $lt: now },
            },
            data: { affiliate_expired: true },
          });
          const usersToCheck = await strapi.entityService.findMany("plugin::users-permissions.user", {
          filters: {
            $or: [
              { level_5_commission_window_expired: false, level_5_commission_window_expiredAt: { $lt: now } },
              { level_10_commission_window_expired: false, level_10_commission_window_expiredAt: { $lt: now } }
            ]
          },
          populate: { referrals: true } // Assuming 'referrals' is the field name
        });

        for (const user of usersToCheck) {
          // Count active referrals (where confirm_affiliate_payment is true)
          const activeReferralCount = user.referrals?.filter((r:any) => r.confirm_affiliate_payment === true).length || 0;

          let updateData:any = {};

          // ✅ Level 5 Logic: Run if active referrals < 3
          if (user.level_5_commission_window_expiredAt < now && activeReferralCount < 3) {
            updateData.level_5_commission_window_expired = true;
          }

          // ✅ Level 10 Logic: Run if active referrals < 5
          if (user.level_10_commission_window_expiredAt < now && activeReferralCount < 5) {
            updateData.level_10_commission_window_expired = true;
          }

          if (Object.keys(updateData).length > 0) {
            await strapi.entityService.update("plugin::users-permissions.user", user.id, { data: updateData });
          }
        }

          // const userExpiryResult = await strapi.db
          //   .query("plugin::users-permissions.user")
          //   .updateMany({
          //     where: {
          //       affiliate_expired: false,
          //       affiliate_expiredAt: { $lt: now },
          //     },
          //     data: {
          //       affiliate_expired: true,
          //     },
          //   });

          // strapi.log.info(`✅ User affiliates expired → ${userExpiryResult.count || 0} users`);

          // const level5ExpiryResult = await strapi.db
          //   .query("plugin::users-permissions.user")
          //   .updateMany({
          //     where: {
          //       level_5_commission_window_expired: false,
          //       level_5_commission_window_expiredAt: { $lt: now },
          //     },
          //     data: {
          //       level_5_commission_window_expired: true,
          //     },
          //   });

          // strapi.log.info(
          //   `✅ Level 5 commission windows expired → ${level5ExpiryResult.count || 0} users`
          // );
          //   const level10ExpiryResult = await strapi.db
          //   .query("plugin::users-permissions.user")
          //   .updateMany({
          //     where: {
          //       level_10_commission_window_expired: false,
          //       level_10_commission_window_expiredAt: { $lt: now },
          //     },
          //     data: {
          //       level_10_commission_window_expired: true,
          //     },
          //   });

          // strapi.log.info(
          //   `✅ Level 10 commission windows expired → ${level10ExpiryResult.count || 0} users`
          // );
          const clubResult = await strapi
            .db.query("api::user-club-status.user-club-status")
            .updateMany({
              filters: {
                isActive: true,
                expiresAt: { $lt: now },
              },
              data: {
                isActive: false,
                washedOutAt: now,
              },
            });

          strapi.log.info(
            `✅ Clubs washed out → ${clubResult.count || 0} users`
          );

          strapi.log.info("✅ CRON SUCCESS: bonus & club washout completed");
        } catch (error) {
          strapi.log.error("❌ CRON ERROR: bonus & club washout", error);
        }
      },
    }
  },
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    watchIgnoreFiles: [
      "**/node_modules/**",
      "**/build/**",
      "**/dist/**",
    ],
    allowedHosts: [
      "api.feminaforce.com",
      "api.educandle.com",
      "api.thechartsfx.com"
    ],
  }

});

