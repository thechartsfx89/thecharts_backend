/**
 * referral-tree service
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreService('api::referral-tree.referral-tree');

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
    "api::referral-tree.referral-tree",
    ({ strapi }) => ({

        async getRootUsers(page: number, pageSize: number) {
            const [users, total] = await Promise.all([
                strapi.db.query("plugin::users-permissions.user").findMany({
                    where: { referredBy: null },
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                    select: ["id", "username", "fullName", "createdAt"],
                }),
                strapi.db.query("plugin::users-permissions.user").count({
                    where: { referredBy: null },
                }),
            ]);

            return {
                pagination: { page, pageSize, total },
                users: users.map(u => ({ ...u, hasChildren: true })),
            };
        },

        async getChildren(parentId: number, page: number, pageSize: number) {
            const [users, total] = await Promise.all([
                strapi.db.query("plugin::users-permissions.user").findMany({
                    where: { referredBy: parentId },
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                    select: ["id", "username", "fullName", "createdAt"],
                }),
                strapi.db.query("plugin::users-permissions.user").count({
                    where: { referredBy: parentId },
                }),
            ]);

            return {
                parentId,
                pagination: { page, pageSize, total },
                users: users.map(u => ({ ...u, hasChildren: true })),
            };
        },

        async getUpline(userId: number) {
            const uplines = [];
            let currentUserId = userId;

            while (true) {
                const user = await strapi
                    .db.query("plugin::users-permissions.user")
                    .findOne({
                        where: { id: currentUserId },
                        populate: {
                            referredBy: {
                                select: ["id", "username", "fullName"],
                            },
                        },
                    });

                if (!user?.referredBy) break;

                uplines.push({
                    id: user.referredBy.id,
                    username: user.referredBy.username,
                    fullName: user.referredBy.fullName,
                });

                currentUserId = user.referredBy.id;
            }

            return uplines; // immediate parent → root
        },

        // async getUsersByLevel(
        //     userId: number,
        //     level: number,
        //     page: number,
        //     pageSize: number
        // ) {
        //     let currentLevelIds = [userId];

        //     // Traverse level by level
        //     for (let currentLevel = 1; currentLevel <= level; currentLevel++) {
        //         const usersAtThisLevel = await strapi
        //             .db.query("plugin::users-permissions.user")
        //             .findMany({
        //                 where: {
        //                     referredBy: currentLevelIds, // ✅ IMPORTANT FIX
        //                 },
        //                 select: ["id"],
        //             });

        //         if (!usersAtThisLevel.length) {
        //             currentLevelIds = [];
        //             break;
        //         }

        //         currentLevelIds = usersAtThisLevel.map(u => u.id);
        //     }

        //     // Pagination AFTER level is resolved
        //     const total = currentLevelIds.length;
        //     const paginatedIds = currentLevelIds.slice(
        //         (page - 1) * pageSize,
        //         page * pageSize
        //     );

        //     const users = await strapi
        //         .db.query("plugin::users-permissions.user")
        //         .findMany({
        //             where: { id: paginatedIds },
        //             select: ["id", "username", "fullName", "createdAt"],
        //         });

        //     return {
        //         userId,
        //         level,
        //         pagination: {
        //             page,
        //             pageSize,
        //             total,
        //             pageCount: Math.ceil(total / pageSize),
        //         },
        //         users,
        //     };
        // }

// async getUsersByLevel(userId: number, level: number) {
//   let currentLevelIds = [userId];

//   // BFS by levels
//   for (let currentLevel = 1; currentLevel <= level; currentLevel++) {
//     const usersAtLevel = await strapi
//       .db.query("plugin::users-permissions.user")
//       .findMany({
//         where: {
//           referredBy: currentLevelIds, // FK-based query
//         },
//         select: ["id"],
//       });

//     if (!usersAtLevel.length) {
//       currentLevelIds = [];
//       break;
//     }

//     currentLevelIds = usersAtLevel.map(u => u.id);
//   }

//   if (!currentLevelIds.length) {
//     return {
//       userId,
//       level,
//       count: 0,
//       users: [],
//     };
//   }

//   const users = await strapi
//     .db.query("plugin::users-permissions.user")
//     .findMany({
//       where: { id: currentLevelIds },
//       select: ["id", "username", "fullName", "doc_date", "confirm_affiliate_payment"],
//     });

//   return {
//     userId,
//     level,
//     count: users.length,
//     users,
//   };
// }
async getUsersByLevel(userId: number, level: number) {
  // 1️⃣ Fetch the root user first
  const rootUser = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { id: userId },
    populate: {
        referredBy: { select: ["id"] },
        profile_img: true, // Ensure this matches your field name in the schema
      },
    select: ["id", "username", "fullName", "doc_date", "confirm_affiliate_payment", "profile_img_path", "createdAt"],
  });

  if (!rootUser) {
    return { userId, level, count: 0, users: [], root: null };
  }

  // 2️⃣ BFS to get IDs at requested level
  let currentLevelIds = [userId];
  for (let currentLevel = 1; currentLevel <= level; currentLevel++) {
    const usersAtLevel = await strapi.db.query("plugin::users-permissions.user").findMany({
      where: { referredBy: currentLevelIds },
      select: ["id"],
    });

    if (!usersAtLevel.length) {
      currentLevelIds = [];
      break;
    }
    currentLevelIds = usersAtLevel.map(u => u.id);
  }

  // 3️⃣ Fetch detailed users at the target level
  let usersRaw = [];
  if (currentLevelIds.length > 0) {
    usersRaw = await strapi.db.query("plugin::users-permissions.user").findMany({
      where: { id: currentLevelIds },
      populate: {
        profile_img: true, 
        referredBy: { select: ["id"] },
      },
      select: ["id", "username", "fullName", "doc_date", "confirm_affiliate_payment", "profile_img_path", "createdAt"],
      orderBy: { createdAt: 'asc' },
    });
  }

  // Helper to format image object
  const formatImage = (img:any) => img ? {
    id: img.id,
    url: img.url,
    formats: img.formats,
  } : null;

  return {
    userId,
    level,
    count: usersRaw.length,
    root: {
      id: rootUser.id,
      name: rootUser.fullName,
      designation: rootUser.username,
      docDate: rootUser.createdAt,
      createdAt: rootUser.createdAt,
      status: rootUser.confirm_affiliate_payment,
      profile_img_path: rootUser.profile_img_path ?? null,
      profile_image: formatImage(rootUser.profile_img),
    },
    // 4️⃣ Map the child users to include the profile_image
    users: usersRaw.map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      doc_date: u.createdAt,
      createdAt: u.createdAt,
      confirm_affiliate_payment: u.confirm_affiliate_payment,
      profile_img_path: u.profile_img_path,
      profile_image: formatImage(u.profile_img), // This adds the missing data
    })),
  };
},
// async getUsersByLevel(userId: number, level: number) {
//   // 1️⃣ Fetch the root user first
//   const rootUser = await strapi.db.query("plugin::users-permissions.user").findOne({
//     where: { id: userId },
//     populate: {
//         referredBy: { select: ["id"] },
//         profile_img: true,
//       },
//     select: ["id", "username", "full_name", "doc_date", "confirm_affiliate_payment","profile_img_path"],
//   });

//   if (!rootUser) {
//     return {
//       userId,
//       level,
//       count: 0,
//       users: [],
//       root: null,
//     };
//   }

//   // 2️⃣ BFS to get users at requested level
//   let currentLevelIds = [userId];
//   for (let currentLevel = 1; currentLevel <= level; currentLevel++) {
//     const usersAtLevel = await strapi.db.query("plugin::users-permissions.user").findMany({
//       where: {
//         referredBy: currentLevelIds,
//       },
//       populate: {
//         referredBy: { select: ["id"] },
//         profile_img: true,
//       },
//       select: ["id"],
//     });

//     if (!usersAtLevel.length) {
//       currentLevelIds = [];
//       break;
//     }

//     currentLevelIds = usersAtLevel.map(u => u.id);
//   }

//   // 3️⃣ Fetch users at the target level
//   let users = [];
//   if (currentLevelIds.length > 0) {
//     users = await strapi.db.query("plugin::users-permissions.user").findMany({
//         populate: {
//         referredBy: { select: ["id"] },
//         profile_img: true,
//       },
//       where: { id: currentLevelIds },
//       select: ["id", "username", "full_name", "doc_date", "confirm_affiliate_payment", "profile_img_path"],
//     });
//   }

//   return {
//     userId,
//     level,
//     count: users.length,
//     root: {
//       id: rootUser.id,
//       name: rootUser.fullName,
//       designation: rootUser.username,
//       docDate: rootUser.doc_date,
//       status: rootUser.confirm_affiliate_payment,
//       profile_img_path: rootUser.profile_img_path ?? null,
//       profile_image: rootUser.profile_img
//           ? {
//               id: rootUser.profile_img.id,
//               url: rootUser.profile_img.url,
//               formats: rootUser.profile_img.formats,
//               }
//             : null,
//     },
//     users,
//   };
// },

// async getHierarchy(parentId: number) {
//   const users = await strapi
//     .db.query("plugin::users-permissions.user")
//     .findMany({
//       populate: {
//         referredBy: {
//           select: ["id"],
//         },
//       },
//       select: [
//         "id",
//         "username",
//         "full_name",
//         "doc_date",
//         "confirm_affiliate_payment",
//         "createdAt",
//       ],
//     });

//   // 🔹 Build adjacency map
//   const childrenMap = new Map<number, any[]>();

//   for (const user of users) {
//     const parent = user.referredBy?.id;
//     if (!parent) continue;

//     if (!childrenMap.has(parent)) {
//       childrenMap.set(parent, []);
//     }

//     childrenMap.get(parent)!.push(user);
//   }

//   // 2️⃣ BFS traversal
//   const queue = [{ id: parentId, level: 0 }];
//   const visited = new Set<number>();
//   const uniqueUsers = new Map<number, any>();

//   while (queue.length) {
//     const { id, level } = queue.shift()!;
//     if (visited.has(id)) continue;

//     visited.add(id);

//     const children = childrenMap.get(id) || [];

//     for (const child of children) {
//       if (!uniqueUsers.has(child.id)) {
//         uniqueUsers.set(child.id, {
//           user: {
//             id: child.id,
//             username: child.username,
//             fullName: child.full_name,
//             doc_date: child.doc_date,
//             confirm_affiliate_payment: child.confirm_affiliate_payment,
//             createdAt: child.createdAt,
//           },
//           level: level + 1,
//         });
//       }

//       queue.push({ id: child.id, level: level + 1 });
//     }
//   }

//   return {
//     count: uniqueUsers.size,
//     users: Array.from(uniqueUsers.values()),
//   };
// }
async getHierarchy(parentId: number) {
  // 1️⃣ Fetch ALL users once
  const users = await strapi
    .db.query("plugin::users-permissions.user")
    .findMany({
      populate: {
        referredBy: { select: ["id"] },
        profile_img: true,
      },
      select: [
        "id",
        "documentId",
        "username",
        "fullName",
        "createdAt",
        "affiliateJoinedAt",
        "mobileNumber",
        "profile_img_path"
      ],
    });

  // 2️⃣ Build children map
  const childrenMap = new Map<number, any[]>();

  for (const user of users) {
    const parent = user.referredBy?.id;
    if (!parent) continue;

    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, []);
    }

    childrenMap.get(parent)!.push(user);
  }

  // 🔹 Helper: count total downline
  const countDownline = (rootId: number) => {
    const queue = [rootId];
    const visited = new Set<number>();

    while (queue.length) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;

      visited.add(current);

      const children = childrenMap.get(current) || [];
      for (const child of children) {
        queue.push(child.id);
      }
    }

    // exclude self
    return visited.size - 1;
  };

  // 3️⃣ BFS traversal with levels
  const queue: Array<{ id: number; level: number }> = [
    { id: parentId, level: 0 },
  ];

  const visited = new Set<number>();
  const results: any[] = [];

  while (queue.length) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;

    visited.add(id);

    const children = childrenMap.get(id) || [];

    for (const child of children) {
      results.push({
        user: {
          id: child.id,
          documentId: child.documentId,
          username: child.username,
          fullName: child.fullName,
          createdAt: child.createdAt,
          affiliateJoinedAt: child.affiliateJoinedAt ?? null,
          mobile: child.mobileNumber ?? null,
          profile_img_path: child.profile_img_path ?? null,
          profile_image: child.profile_img
            ? {
                id: child.profile_img.id,
                url: child.profile_img.url,
                formats: child.profile_img.formats,
              }
            : null,
        },
        level: level + 1,
        joinedAt: child.createdAt,
        downlineCount: countDownline(child.id),
      });

      queue.push({ id: child.id, level: level + 1 });
    }
  }

  return {
    count: results.length,
    users: results,
  };
},

async getHierarchyByLevel(parentId: number, targetLevel: number) {
  // 1️⃣ Fetch ALL users once
  const users = await strapi
    .db.query("plugin::users-permissions.user")
    .findMany({
      populate: {
        referredBy: { select: ["id"] },
        profile_img: true,
      },
      select: [
        "id",
        "documentId",
        "username",
        "fullName",
        "createdAt",
        "affiliateJoinedAt",
        "mobileNumber",
        "confirm_affiliate_payment",
        "profile_img_path"
      ],
    });

  // 2️⃣ Build children map
  const childrenMap = new Map<number, any[]>();

  for (const user of users) {
    const parent = user.referredBy?.id;
    if (!parent) continue;

    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, []);
    }

    childrenMap.get(parent)!.push(user);
  }

  // 🔹 Downline count helper (unchanged)
  const countDownline = (rootId: number) => {
    const queue = [rootId];
    const visited = new Set<number>();

    while (queue.length) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;

      visited.add(current);
      const children = childrenMap.get(current) || [];
      for (const child of children) queue.push(child.id);
    }

    return visited.size - 1;
  };

  // 3️⃣ BFS WITH LEVEL CAP
  const queue: Array<{ id: number; level: number }> = [
    { id: parentId, level: 0 },
  ];

  const visited = new Set<number>();
  const results: any[] = [];

  while (queue.length) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;

    visited.add(id);

    // ❌ Stop going deeper than target level
    if (level >= targetLevel) continue;

    const children = childrenMap.get(id) || [];

    for (const child of children) {
      const childLevel = level + 1;

      // ✅ ONLY collect users at requested level
      if (childLevel === targetLevel) {
        results.push({
          user: {
            id: child.id,
            documentId: child.documentId,
            username: child.username,
            fullName: child.fullName,
            createdAt: child.createdAt,
            affiliateJoinedAt: child.affiliateJoinedAt ?? null,
            status: child.confirm_affiliate_payment,
            mobile: child.mobileNumber ?? null,
            profile_img_path: child.profile_img_path ?? null,
            profile_image: child.profile_img
              ? {
                  id: child.profile_img.id,
                  url: child.profile_img.url,
                  formats: child.profile_img.formats,
                }
              : null,
          },
          level: childLevel,
          joinedAt: child.createdAt,
          downlineCount: countDownline(child.id),
        });
      }

      queue.push({ id: child.id, level: childLevel });
    }
  }
results.sort(
  (a, b) =>
    new Date(b.user.createdAt).getTime() -
    new Date(a.user.createdAt).getTime()
);

  return {
    userId: parentId,
    level: targetLevel,
    count: results.length,
    users: results,
  };
}




    })
);

