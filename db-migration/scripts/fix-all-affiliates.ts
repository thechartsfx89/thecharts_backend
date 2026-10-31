'use strict';

module.exports = async ({ strapi }) => {
  console.log("🚀 Starting Full Affiliate Tree Build via CLI...");

  try {
    // 1. Fetch all users who have a referrer
    // We sort by ID DESC to process the newest entries first as requested
    const usersWithParents = await strapi.entityService.findMany("plugin::users-permissions.user", {
      filters: {
        referredBy: {
          id: { $notNull: true },
        },
      },
      sort: { id: 'desc' }, 
      populate: ["referredBy"],
    });

    console.log(`📊 Found ${usersWithParents.length} relationships to process.`);

    let successCount = 0;

    for (const user of usersWithParents) {
      const childId = user.id;
      const parentId = user.referredBy?.id;

      if (!parentId) continue;

      console.log(`--- [${successCount + 1}] Processing: Parent ${parentId} -> Child ${childId} ---`);

      try {
        // 2. Call your service that handles the 10-level tree build and commissions
        await strapi.service("api::affiliate.affiliate").handleUserAffiliateFlow({
          parentId,
          childId,
        });
        
        successCount++;
        console.log(`✅ Success for Child ID: ${childId}`);
      } catch (error) {
        console.error(`❌ Failed for Child ID ${childId}:`, error.message);
      }
    }

    console.log(`\n🏁 Finished! Successfully processed ${successCount} users.`);
  } catch (error) {
    console.error("❌ Fatal Script Error:", error);
  }
};