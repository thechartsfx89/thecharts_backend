/**
 * affiliate-tree controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::affiliate-tree.affiliate-tree');

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::affiliate-tree.affiliate-tree",
  ({ strapi }) => ({
    /**
     * GET /api/affiliate-trees/hierarchy/:parentId
     */
    async hierarchy(ctx) {
      const parentId = Number(ctx.params.parentId);

      if (!parentId) {
        return ctx.badRequest("Parent ID is required");
      }

      const data = await strapi
        .service("api::affiliate-tree.affiliate-tree")
        .getHierarchy(parentId);

      ctx.body = {
        parentId,
        totalMembers: data.length,
        members: data,
      };
    },
     async getUpline(ctx) {
      const childId = Number(ctx.params.childId);

      if (!childId) {
        return ctx.badRequest("Child ID is required");
      }

      const uplines = await strapi
        .service("api::affiliate-tree.affiliate-tree")
        .getUplines(childId);

      ctx.body = {
        childId,
        count: uplines.length,
        uplines,
      };
    },
async getDirectReferrals(ctx) {
      const userId = Number(ctx.params.userId);

      if (!userId) {
        return ctx.badRequest("User ID is required");
      }

      const referrals = await strapi
        .service("api::affiliate-tree.affiliate-tree")
        .getDirectReferrals(userId);

      ctx.body = {
        userId,
        count: referrals.length,
        referrals,
      };
    },

  //   async getHierarchyDashDetails(ctx) {
  //   try {
  //     const { parentId } = ctx.params;

  //     // Validate that parentId is a number
  //     if (!parentId) {
  //       return ctx.badRequest('Parent ID is required');
  //     }

  //     // Call the service logic we built
  //     const data = await strapi
  //       .service('api::affiliate-tree.affiliate-tree')
  //       .getHierarchyDashDetails(Number(parentId));

  //     // Return the data with a 200 OK status
  //     return ctx.send(data);
  //   } catch (err) {
  //     ctx.throw(500, err);
  //   }
  // },
 async getHierarchyDashDetails(ctx) {
    try {
      const user = ctx.state.user; // Logged in Strapi user
      const { parentId } = ctx.params;
    
      // Determine if user is Admin (checking the Strapi role type)
      const isAdmin = user?.role?.type === 'admin';
  console.log({parentId})
      let stats;

      if (!parentId) {
        // 1. Admin wants Global Overview
        stats = await strapi
          .service('api::affiliate-tree.affiliate-tree')
          .getGlobalStats();
      } else {
        // 2. Admin wants specific user's tree OR User wants their own tree
        // Force non-admins to only see their own ID
        const targetId = isAdmin ? Number(parentId) : user.id;

        if (!targetId) {
          return ctx.badRequest('Target User ID is required');
        }

        stats = await strapi
          .service('api::affiliate-tree.affiliate-tree')
          .getHierarchyDashDetails(targetId);
      }

      return ctx.send({ data: stats });
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  })
);

