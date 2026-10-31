export default {
  eligibilityExpiry: {
    task: async ({ strapi }) => {
      strapi.log.info("⏳ Running affiliate bonus washout job");

      const now = new Date();

      // 1️⃣ Expire bonus eligibility
      await strapi
        .documents("api::user-bonus-status.user-bonus-status")
        .updateMany({
          filters: {
            isUnlocked: true,
            expiresAt: { $lt: now },
          },
          data: {
            isUnlocked: false,
            washedOutAt: now,
          },
        });

      strapi.log.info("✅ Bonus eligibility washed out");
    },

    options: {
      rule: "0 0 * * *", // every day at midnight
      timezone: "Asia/Kolkata",
    },
  },
};
