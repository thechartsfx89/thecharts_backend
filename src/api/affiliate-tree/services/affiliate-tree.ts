/**
 * affiliate-tree service
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreService('api::affiliate-tree.affiliate-tree');

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::affiliate-tree.affiliate-tree",
  ({ strapi }) => ({
    /**
     * Get unique downline users under a parent
     */
    async getHierarchy(parentId: number) {
      // 1️⃣ Fetch all edges ONCE
      const edges = await strapi
        .documents("api::affiliate-tree.affiliate-tree")
        .findMany({
          populate: ["parentUser", "childUser"],
        });

      const queue: number[] = [parentId];
      const visitedParents = new Set<number>();
      const uniqueUsers = new Map<number, any>(); // userId → user

      // 2️⃣ BFS traversal
      while (queue.length) {
        const currentParent = queue.shift();
        if (!currentParent || visitedParents.has(currentParent)) continue;

        visitedParents.add(currentParent);

        const children = edges.filter(
          (e: any) => e.parentUser?.id === currentParent
        );

        for (const edge of children) {
          const child: any = edge.childUser;
          if (!child) continue;

          // ✅ Store unique user only once
          if (!uniqueUsers.has(child.id)) {
            uniqueUsers.set(child.id, {
              // usera: child,
              user: {
                id: child.id,
                documentId: child.documentId,
                username: child.username,
                fullName: child.fullName,
                createdAt: child.createdAt,
              },
              level: edge.level,
            });
          }

          queue.push(child.id);
        }
      }

      return {
        count: uniqueUsers.size,
        users: Array.from(uniqueUsers.values()),
      };
    },

    async getUplines(childId: number) {
      const edges = await strapi
        .documents("api::affiliate-tree.affiliate-tree")
        .findMany({
          populate: ["parentUser", "childUser"],
          sort: ["level:asc"],
        });

      const uplines: any[] = [];
      let currentChild: any = childId;

      while (true) {
        const edge = edges.find(
          (e: any) => e.childUser?.id === currentChild
        );
        if (!edge?.parentUser) break;

        uplines.push(edge.parentUser);
        currentChild = edge.parentUser.id;
      }

      return uplines;
    },

     async getDirectReferrals(userId: number) {
      // 1️⃣ Fetch ALL edges once
      const edges = await strapi
  .db.query("api::affiliate-tree.affiliate-tree")
  .findMany({
    populate: {
      parentUser: {
        populate: ["profile_img"],
      },
      childUser: {
        populate: ["profile_img"],
      },
    },
  });

      // 2️⃣ Get direct referrals (level = 1)
      const directEdges = edges.filter(
        (e: any) =>
          e.parentUser?.id === userId && e.level === 1 && e.childUser
      );

      // 3️⃣ Helper → count downline for a user
      const countDownline = (parentId: number) => {
        const queue = [parentId];
        const visited = new Set<number>();

        while (queue.length) {
          const current = queue.shift();
          if (!current || visited.has(current)) continue;

          visited.add(current);

          const children = edges.filter(
            (e: any) => e.parentUser?.id === current
          );

          for (const edge of children) {
            if (edge.childUser) {
              queue.push(edge.childUser.id);
            }
          }
        }

        // ❌ exclude the parent itself
        return visited.size - 1;
      };

      // 4️⃣ Build response
     return directEdges.map((e: any) => ({
  user: {
    id: e.childUser.id,
    documentId: e.childUser.documentId,
    username: e.childUser.username,
    fullName: e.childUser.fullName,
    createdAt: e.childUser.createdAt,
    affiliateJoinedAt: e.childUser.affiliateJoinedAt,
    mobile: e.childUser.mobileNumber,
    // ✅ PROFILE IMAGE
    profile_img: e.childUser.profile_img
      ? {
          id: e.childUser.profile_img.id,
          url: e.childUser.profile_img.url,
          formats: e.childUser.profile_img.formats,
        }
      : null,
  },
  level: 1,
  joinedAt: e.createdAt,
  downlineCount: countDownline(e.childUser.id),
}));

    },

// async getHierarchyDashDetails(parentId: number) {
//   const edges = await strapi
//     .documents("api::affiliate-tree.affiliate-tree")
//     .findMany({
//       populate: ["parentUser", "childUser"],
//     });

//   const queue: number[] = [parentId];
//   const visitedParents = new Set<number>();
//   const uniqueUsers = new Set<number>(); // We only need IDs now to track unique members

//   let totalLevel1Count = 0;
//   let totalActiveCount = 0;

//   while (queue.length) {
//     const currentParent = queue.shift();
//     if (!currentParent || visitedParents.has(currentParent)) continue;

//     visitedParents.add(currentParent);

//     const children = edges.filter(
//       (e: any) => e.parentUser?.id === currentParent
//     );

//     for (const edge of children) {
//       const child: any = edge.childUser;
//       if (!child) continue;

//       if (!uniqueUsers.has(child.id)) {
//         uniqueUsers.add(child.id);

//         // Count Directs
//         if (edge.level === 1) {
//           totalLevel1Count++;
//         }

//         // Count Active (Payment Confirmed)
//         if (child.confirm_affiliate_payment === true) {
//           totalActiveCount++;
//         }

//         queue.push(child.id);
//       }
//     }
//   }

//   return {
//     totalHierarchyCount: uniqueUsers.size,
//     totalLevel1Count: totalLevel1Count,
//     totalActiveCount: totalActiveCount,
//   };
// }
async getGlobalStats() {
    // Count all unique entries in the tree
    // const totalHierarchyCount = await strapi.db.query('api::affiliate-tree.affiliate-tree').count();

    // // Count Level 1 entries across the whole platform
    // const totalLevel1Count = await strapi.db.query('api::affiliate-tree.affiliate-tree').count({
    //   where: { level: 1 }
    // });
const totalHierarchyCount = await strapi.db.query('plugin::users-permissions.user').count();
    // Count all users who have confirmed their affiliate payment
    const totalActiveCount = await strapi.db.query('plugin::users-permissions.user').count({
      where: { confirm_affiliate_payment: true }
    });

    return {
      scope: 'global',
      totalHierarchyCount,
      totalLevel1Count: null,
      totalActiveCount,
    };
  },

  // USER/INSPECTION SERVICE: Walk the tree level-by-level
  async getHierarchyDashDetails(parentId: number) {
    const uniqueUsers = new Set<number>();
    let totalLevel1Count = 0;
    let totalActiveCount = 0;

    let currentParentIds = [parentId];

    while (currentParentIds.length > 0) {
      const edges = await strapi.documents("api::affiliate-tree.affiliate-tree").findMany({
        filters: {
          parentUser: { id: { $in: currentParentIds } }
        },
        fields: ["level"],
        populate: {
          childUser: { fields: ["id", "confirm_affiliate_payment"] },
        },
      });

      if (edges.length === 0) break;

      const nextParentIds: number[] = [];

      for (const edge of edges) {
        const child: any = edge.childUser;
        if (!child || uniqueUsers.has(child.id)) continue;

        uniqueUsers.add(child.id);

        if (edge.level === 1) totalLevel1Count++;
        if (child.confirm_affiliate_payment === true) totalActiveCount++;

        nextParentIds.push(child.id);
      }

      currentParentIds = nextParentIds;
      if (uniqueUsers.size > 10000) break; // Increased safety limit
    }

    return {
      scope: 'individual',
      targetId: parentId,
      totalHierarchyCount: uniqueUsers.size,
      totalLevel1Count,
      totalActiveCount,
    };
  },

  })
);


