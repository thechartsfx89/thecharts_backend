/**
 * commission controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::commission.commission');
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::commission.commission",
  ({ strapi }) => ({

    /**
     * GET /api/commissions/user-level-summary/:userId
     */
    async userLevelSummary(ctx) {
      const userId = Number(ctx.params.userId);

      if (!userId) {
        return ctx.badRequest("User ID is required");
      }

      const result = await strapi
        .service("api::commission.commission")
        .getUserLevelCommission(userId);

      ctx.body = result;
    },
    async userClubSummary(ctx) {
      const userId = Number(ctx.params.userId);

      if (!userId) {
        return ctx.badRequest("User ID is required");
      }

      const result = await strapi
        .service("api::commission.commission")
        .getUserClubCommission(userId);

      ctx.body = result;
    },
    async myHistory(ctx) {
      const userId = ctx.state.user?.id;

      if (!userId) {
        return ctx.unauthorized("User not authenticated");
      }

      const data = await strapi
        .service("api::commission.commission")
        .getMyHistory(userId);

      ctx.body = data;
    },
    async mySummary(ctx) {
      const userId = ctx.state.user?.id;

      if (!userId) {
        return ctx.unauthorized("User not authenticated");
      }

      const data = await strapi
        .service("api::commission.commission")
        .getUserCommissionSummary(userId);

      ctx.body = data;
    },
    async userSummary(ctx) {
      const userId = Number(ctx.params.userId);

      if (!userId) {
        return ctx.badRequest("Valid userId is required");
      }

      const data = await strapi
        .service("api::commission.commission")
        .getUserCommissionSummary(userId);

      ctx.body = data;
    },

    async getStats(ctx) {
      // 1. Extract both parameters from the URL
      const { userId, year } = ctx.params;

      try {
        // 2. Pass them to the service
        const data = await strapi
          .service('api::commission.commission')
          .getChartData(year, userId);

        return { data };
      } catch (err) {
        return ctx.badRequest("Stats Error", { details: err.message });
      }
    },
    async myWalletSummary(ctx) {
     

      const userId = ctx.params.userId;
      if (!userId) {
        return ctx.unauthorized("User not authenticated");
      }

      try {
        const data = await strapi
          .service("api::commission.commission")
          .getUserWalletSummary(userId);

        return (ctx.body = { data });
      } catch (error) {
        strapi.log.error('Wallet Summary Error:', error);
        return ctx.internalServerError("Error calculating wallet");
      }
    },

    async getAdminGlobalSummary(ctx) {
    try {
      // Security: Only allow users with 'admin' role
      // const user = ctx.state.user;
      // if (user?.role?.type !== 'admin') {
      //   return ctx.forbidden("Only administrators can access global stats.");
      // }

      const data = await strapi
        .service("api::commission.commission")
        .getGlobalWalletSummary();

      return (ctx.body = { data });
    } catch (error) {
      // strapi.log.error("Admin Global Summary Error:", error);
      return ctx.internalServerError("Failed to calculate global summary");
    }
  },

  // src/api/commission/controllers/commission.js

// async getUsersGlobalSummary(ctx) {
//     try {
//         const { page, pageSize } = ctx.query;
        
//         const result = await strapi
//             .service("api::commission.commission")
//             .getUsersGlobalSummary({ page, pageSize });

//         return ctx.send(result);
//     } catch (error) {
//         strapi.log.error('Global Summary Error:', error);
//         return ctx.internalServerError("Could not fetch paginated summary");
//     }
// }
// src/api/commission/controllers/commission.ts

// async getUsersGlobalSummary(ctx: any) {
//   const { page, pageSize, sort, search } = ctx.query;
  
//   const results = await strapi
//     .service("api::commission.commission")
//     .getUsersGlobalSummary({ page, pageSize, sort, search });

//   return ctx.send(results);
// }
// src/api/commission/controllers/commission.js

// async getUsersGlobalSummary(ctx) {
//     try {
//         // Extract all possible query params
//         const { page, pageSize, sort, search } = ctx.query;
        
//         const result = await strapi
//             .service("api::commission.commission")
//             .getUsersGlobalSummary({ 
//                 page: page || 1, 
//                 pageSize: pageSize || 10, 
//                 sort: sort || 'createdAt:asc',
//                 search: search || "" // Ensure this is passed
//             });

//         return ctx.send(result);
//     } catch (error) {
//         strapi.log.error('Global Summary Error:', error);
//         return ctx.internalServerError("Could not fetch summary");
//     }
// }

// src/api/commission/controllers/commission.js

async getUsersGlobalSummary(ctx) {
    try {
        let { page, pageSize, sort, search } = ctx.query;

        // ✅ If there is a search term, force the page to 1
        // if (search && search.trim() !== "") {
        //     page = 1;
        // }

        const result = await strapi
            .service("api::commission.commission")
            .getUsersGlobalSummary({ 
                page: page || 1, 
                pageSize: pageSize || 10, 
                sort: sort || 'createdAt:desc',
                search: search || "" 
            });

        return ctx.send(result);
    } catch (error) {
        strapi.log.error('Global Summary Error:', error);
        return ctx.internalServerError("Could not fetch summary");
    }
}
  })
);
