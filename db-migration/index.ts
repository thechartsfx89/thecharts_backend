import dotenv from "dotenv";
import { migrateToStrapi } from "./migrate/migrateToStrapi";
dotenv.config({ path: "./db-migration/.env" });

// import { migrateToStrapi } from "./migrate/migrateToStrapi.js";

const TABLES = [
  // { schema: "dbo", source: "Product_Order_Details", strapi: "product_order_details" },

  // { schema: "dbo", source: "vwKYCcomplete", strapi: "tbl_kyc_completes" },

  // { schema: "dbo", source: "upgrade_Request", strapi: "upgrade_requests" },

  // { schema: "dbo", source: "TblKYCDocument", strapi: "tbl_kyc_documents" },

  // { schema: "dbo", source: "tblBV", strapi: "tbl_binary_volumes" },

  // { schema: "dbo", source: "MEMBER_SOACCOUNT", strapi: "member_settlement_accounts" },

  // { schema: "dbo", source: "member_Payment_Details", strapi: "member_payment_details" },

  // { schema: "dbo", source: "Member_level_JoinDetailsB", strapi: "member_level_join_detail_binaries" },

  // { schema: "dbo", source: "Member_level_JoinDetails", strapi: "member_level_join_details" },

  //  { schema: "dbo", source: "Member_LevelB", strapi: "member_level_binaries" },
  // { schema: "dbo", source: "Member_Level", strapi: "member_levels" },
 
  // { schema: "dbo", source: "member_Master_temp", strapi: "member_master_temps" },
  // { schema: "dbo", source: "member_Cycle_Master", strapi: "member_cycle_masters" },

  // Done
  //  { schema: "dbo", source: "member_Master", strapi: "member_masters" },

  //  { schema: "dbo", source: "Member_login", strapi: "member_logins" },

  // { schema: "dbo", source: "MEMBER_ACCOUNT", strapi: "member_accounts" },

  // { schema: "dbo", source: "member_Cycle_Master", strapi: "member_cycle_masters" },

// { schema: "dbo", source: "member_Master_temp", strapi: "member_master_temps" },

//  { schema: "dbo", source: "Member_LevelB", strapi: "member_level_binaries" },

// { schema: "dbo", source: "Member_Level", strapi: "member_levels" },

// { schema: "dbo", source: "Member_level_JoinDetails", strapi: "member_level_join_details" },

// { schema: "dbo", source: "Member_level_JoinDetailsB", strapi: "member_level_join_detail_binaries" },
 
// { schema: "dbo", source: "member_Payment_Details", strapi: "member_payment_details" },

// { schema: "dbo", source: "MEMBER_SOACCOUNT", strapi: "member_settlement_accounts" },

// { schema: "dbo", source: "tblBV", strapi: "tbl_binary_volumes" },

// { schema: "dbo", source: "TblKYCDocument", strapi: "tbl_kyc_documents" },

// { schema: "dbo", source: "upgrade_Request", strapi: "upgrade_requests" },

// { schema: "dbo", source: "vwKYCcomplete", strapi: "tbl_kyc_completes" },
// { schema: "dbo", source: "Product_Order_Details", strapi: "product_order_details" },

// { schema: "dbo", source: "Product_order", strapi: "product_orders" },

// { schema: "dbo", source: "MEMBER_PAYOUT1", strapi: "member_payout_details" },

// { schema: "dbo", source: "MEMBER_ACCOUNT1", strapi: "club_50_members" },
// { schema: "dbo", source: "MEMBER_ACCOUNT2", strapi: "club_250_members" },

// { schema: "dbo", source: "MEMBER_ACCOUNT3", strapi: "club_500_members" },


];

(async () => {
  for (const t of TABLES) {
    await migrateToStrapi(t.schema, t.source, t.strapi);
  }
  console.log("🎯 ALL TABLES MIGRATED INTO STRAPI");
  process.exit(0);
})();
