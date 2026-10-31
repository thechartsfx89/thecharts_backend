/**
 * referral-tree controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::referral-tree.referral-tree');
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::referral-tree.referral-tree",
  ({ strapi }) => ({

    async getRootUsers(ctx) {
      const page = Number(ctx.query.page || 1);
      const pageSize = Number(ctx.query.pageSize || 10);

      ctx.body = await strapi
        .service("api::referral-tree.referral-tree")
        .getRootUsers(page, pageSize);
    },

    async getChildren(ctx) {
      const parentId = Number(ctx.params.parentId);
      if (!parentId) return ctx.badRequest("Parent ID required");

      const page = Number(ctx.query.page || 1);
      const pageSize = Number(ctx.query.pageSize || 10);

      ctx.body = await strapi
        .service("api::referral-tree.referral-tree")
        .getChildren(parentId, page, pageSize);
    },

    async getUpline(ctx) {
      const userId = Number(ctx.params.userId);
      if (!userId) return ctx.badRequest("User ID required");

      ctx.body = await strapi
        .service("api::referral-tree.referral-tree")
        .getUpline(userId);
    },
    async getUsersByLevel(ctx) {
  const userId = Number(ctx.params.userId);
  const level = Number(ctx.params.level);
  const page = Number(ctx.query.page || 1);
  const pageSize = Number(ctx.query.pageSize || 10);

  if (!userId || level < 1) {
    return ctx.badRequest("Invalid userId or level");
  }

  ctx.body = await strapi
    .service("api::referral-tree.referral-tree")
    .getUsersByLevel(userId, level, page, pageSize);
},
 async getHierarchy(ctx) {
      try {
        const { parentId } = ctx.params;

        if (!parentId) {
          return ctx.badRequest("parentId is required");
        }

        const parentIdNum = Number(parentId);

        if (isNaN(parentIdNum)) {
          return ctx.badRequest("Invalid parentId");
        }

        const data = await strapi
          .service("api::referral-tree.referral-tree")
          .getHierarchy(parentIdNum);

        ctx.send({
          success: true,
          data,
        });
      } catch (error) {
        strapi.log.error("getHierarchy error:", error);
        ctx.internalServerError("Something went wrong");
      }
    },
     async getHierarchyByLevel(ctx) {
    try {
      const userId = Number(ctx.params.userId);
      const level = Number(ctx.params.level);

      if (!userId || !level || level < 1) {
        return ctx.badRequest("Invalid userId or level");
      }

      const data = await strapi
        .service("api::referral-tree.referral-tree")
        .getHierarchyByLevel(userId, level);

      ctx.send(data);
    } catch (error) {
      strapi.log.error("getHierarchyByLevel error:", error);
      ctx.internalServerError("Something went wrong");
    }
  },

  })
);

