'use strict';

const { createStrapi } = require('@strapi/strapi');

async function main() {
  const strapi = await createStrapi().load();

  console.log("🚀 Starting Full Affiliate Tree Build...");

  try {
    const usersWithParents = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters: {
          referredBy: {
            id: { $notNull: true },
          },
        },
        sort: { id: "desc" },
        populate: ["referredBy"],
      }
    );

    console.log(`📊 Found ${usersWithParents.length} relationships`);

    let success = 0;
    let failed = 0;

    for (const user of usersWithParents) {
      const childId = user.id;
      const parentId = user.referredBy?.id;
      if (!parentId) continue;

      try {
        await strapi
          .service("api::affiliate.affiliate")
          .handleUserAffiliateFlow({ parentId, childId });

        success++;
      } catch (err) {
        failed++;
        console.error(`❌ Failed for Child ${childId}:`, err.message);
      }
    }

    console.log(`🏁 Done | Success: ${success}, Failed: ${failed}`);
  } catch (error) {
    console.error("❌ Fatal Script Error:", error);
  }

  await strapi.destroy();
  process.exit(0);
}

main();