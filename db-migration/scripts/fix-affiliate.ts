// scripts/run-affiliate.js
// module.exports = async () => {
//   const parentId = 3389; // Manually set ID
//   const childId = 3588;  // Manually set ID

//   console.log(`🚀 Starting Affiliate Flow for Parent: ${parentId}, Child: ${childId}`);

//   try {
//     await strapi.service("api::affiliate.affiliate").handleUserAffiliateFlow({
//       parentId,
//       childId,
//     });
//     console.log("✅ Success!");
//   } catch (error) {
//     console.error("❌ Failed:", error);
//   }
  
//   process.exit(0);
// };

export default async ({ strapi }: { strapi: any }) => {
  console.log("🚀 Calling Service: rebuildAllAffiliateTrees...");
  
  try {
    await strapi.service("api::affiliate.affiliate").rebuildAllAffiliateTrees();
    console.log("✅ Migration finished successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
};
