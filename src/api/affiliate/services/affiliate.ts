import { backfillLevelCommission, evaluateBonus, resolveLiveMaxLevel, resolveUnlockedMaxLevel } from "../utils/bonus";

export default () => ({
  async handleUserAffiliateFlow({
    parentId,
    childId,
  }: {
    parentId: number | null;
    childId: number;
  }) {
    if (!parentId) return;

    // await this.linkUserReferral(parentId, childId);
    await this.buildAffiliateTree(parentId, childId);
    await this.updateReferralCounts(parentId);

    // await this.distributeLevelCommission(childId);
    await this.evaluateEligibilityLevelIncome(parentId);
    await this.evaluateClubs(parentId);
    await this.distributeClubCommission(childId);


  },

  // async linkUserReferral(parentId: number, childId: number) {
  //   await strapi.db.query("plugin::users-permissions.user").update({
  //     where: { id: childId },
  //     data: { referredBy: parentId },
  //   });
  // },

  async updateReferralCounts(parentId: number) {
    // 🔹 Direct referrals = level 1
    const directCount = await strapi
      .documents("api::affiliate-tree.affiliate-tree")
      .count({
        filters: {
          parentUser: { id: parentId },
          level: 1,
        },
      });

    // 🔹 Total referrals = all levels
    const totalCount = await strapi
      .documents("api::affiliate-tree.affiliate-tree")
      .count({
        filters: {
          parentUser: { id: parentId },
        },
      });

    strapi.log.info(
      `👥 User ${parentId} → Direct: ${directCount}, Total: ${totalCount}`
    );

    await strapi.db.query("plugin::users-permissions.user").update({
      where: { id: parentId },
      data: {
        directReferralCount: directCount,
        totalReferralCount: totalCount,
      },
    });
  },

  async buildAffiliateTree(parentId: number, childId: any) {
    let currentParentId: any | null = parentId;
    let level = 1;

    while (currentParentId && level <= 10) {
      const exists = await strapi
        .documents("api::affiliate-tree.affiliate-tree")
        .findFirst({
          filters: {
            parentUser: currentParentId,
            childUser: childId,
            level,
          },
        });

      if (!exists) {
        await strapi
          .documents("api::affiliate-tree.affiliate-tree")
          .create({
            data: {
              parentUser: currentParentId,
              childUser: childId,
              level,
            },
          });
      }


      const parent = await strapi
        .db.query("plugin::users-permissions.user")
        .findOne({
          where: { id: currentParentId },
          populate: { referredBy: true },
        });


      currentParentId = parent?.referredBy?.id ?? null;
      level++;
    }
  },

  async rebuildAllAffiliateTrees() {
  console.log("🚀 Starting Bulk Affiliate Tree Reconstruction...");

  // 1. Fetch all users who have a referrer (the "children")
  const allChildren = await strapi.db.query("plugin::users-permissions.user").findMany({
    where: {
      referredBy: { $notNull: true },
    },
    populate: { referredBy: true },
    orderBy: { id: 'desc' },
  });

  console.log(`Found ${allChildren.length} users to process.`);

  // 2. Loop through every child found
  for (const child of allChildren) {
    let currentParentId = child.referredBy?.id;
    let childId = child.id;
    let level = 1;

    console.log(`- Building tree for Child ID: ${childId} starting from Parent: ${currentParentId}`);

    // 3. The "Climbing" Logic (Your existing while loop)
    while (currentParentId && level <= 10) {
      const exists = await strapi
        .documents("api::affiliate-tree.affiliate-tree")
        .findFirst({
          filters: {
            parentUser: currentParentId,
            childUser: childId,
            level,
          },
        });

      if (!exists) {
        await strapi
          .documents("api::affiliate-tree.affiliate-tree")
          .create({
            data: {
              parentUser: currentParentId,
              childUser: childId,
              level,
            },
          });
      }

      // Find the next person up the chain
      const parent = await strapi
        .db.query("plugin::users-permissions.user")
        .findOne({
          where: { id: currentParentId },
          populate: { referredBy: true },
        });

      currentParentId = parent?.referredBy?.id ?? null;
      level++;
    }
  }

  console.log("✅ All affiliate trees have been reconstructed.");
},

  // async evaluateEligibilityLevelIncome(userId: any) {
  //   const user = await strapi
  //     .db.query("plugin::users-permissions.user")
  //     .findOne({
  //       where: { id: userId },
  //     });

  //   console.log("Evaluating bonus for user:", user);
  //   if (!user?.confirm_affiliate_payment) return;

  //   const daysSinceJoin =
  //     (Date.now() - new Date(user.affiliateJoinedAt).getTime()) /
  //     (1000 * 60 * 60 * 24);

  //   if (daysSinceJoin > 35) return;

  //   const rules = await strapi
  //     .documents("api::bonus-rule.bonus-rule")
  //     .findMany();

  //   for (const rule of rules) {
       

  //     if (user.directReferralCount >= rule.directRequired) {
  //       const exists = await strapi
  //         .documents("api::user-bonus-status.user-bonus-status")
  //         .findFirst({
  //           filters: { user: userId, bonusRule: rule.id as any },
  //         });

  //       if (!exists) {
  //         await strapi
  //           .documents("api::user-bonus-status.user-bonus-status")
  //           .create({
  //             data: {
  //               user: userId,
  //               bonusRule: rule.id,
  //               isUnlocked: true,
  //               unlockedAt: new Date(),
  //               expiresAt: new Date(
  //                 Date.now() + rule.validDays * 24 * 60 * 60 * 1000
  //               ),
  //             },
  //           });
  //       }
  //     }
  //   }
  // },
async evaluateEligibilityLevelIncome(userId: any) {
  // 1. Fetch the user's basic info
  const user = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { id: userId },
  });

  if (!user?.confirm_affiliate_payment) return;

  // 2. CALCULATE LIVE COUNT: Count users referred by this user who have confirmed payment
  const activeDirectReferrals = await strapi.db.query("plugin::users-permissions.user").count({
    where: {
      referredBy: userId,
      confirm_affiliate_payment: true,
    },
  });

  console.log(`User ${userId} has ${activeDirectReferrals} active direct referrals.`);

  // 3. Time check (35-day window)
  // const daysSinceJoin = (Date.now() - new Date(user.affiliateJoinedAt).getTime()) / (1000 * 60 * 60 * 24);
  // if (daysSinceJoin > 35) return;

  // 4. Evaluate against Bonus Rules
  const rules = await strapi.documents("api::bonus-rule.bonus-rule").findMany();

  for (const rule of rules) {
    // Use the dynamic count 'activeDirectReferrals' here
    if (activeDirectReferrals >= rule.directRequired) {
      const exists = await strapi
        .documents("api::user-bonus-status.user-bonus-status")
        .findFirst({
          filters: { user: userId, bonusRule: rule.id as any },
        });

      if (!exists) {
        await strapi.documents("api::user-bonus-status.user-bonus-status").create({
          data: {
            user: userId,
            bonusRule: rule.id,
            isActive: true,
            activatedAt: new Date(),
            expiresAt: new Date(Date.now() + rule.validDays * 24 * 60 * 60 * 1000),
            publishedAt: new Date(), // Required for v5 visibility
          },
        });
        
        // Optional: Sync the calculated count back to the User record for UI display
        // await strapi.db.query("plugin::users-permissions.user").update({
        //   where: { id: userId },
        //   data: { directReferralCount: activeDirectReferrals }
        // });
      }
    }
  }
},
async distributeLevelCommission(childId: number) {
    const commissionConfig = await strapi
      .documents("api::commission-level.commission-level")
      .findFirst({ populate: ["level"] });

    if (!commissionConfig?.level) return;

    // 1️⃣ Fetch all ancestors for this child (The full 10-level path)
    const ancestors = await strapi
      .documents("api::affiliate-tree.affiliate-tree")
      .findMany({
        filters: { childUser: { id: childId } }, // Ensure this returns all 10 levels
        populate: ["parentUser"],
        sort: ["level:asc"],
      });
// console.log(`Ancestors for Child ${childId}:`, ancestors);
    // 2️⃣ Process each ancestor in the path
    for (const edge of ancestors) {
      const parent = edge.parentUser;
      const level = edge.level; // Distance from child to this parent

      if (!parent || parent.affiliate_expired) continue;

      // Check restrictions (Matches your Educandle logic)
      if (level > 1 && parent.level_5_commission_window_expired) continue;
      if (level > 5 && parent.level_10_commission_window_expired) continue;
      
      // Check if parent has actually paid their own affiliate fee
      if (!parent.confirm_affiliate_payment) continue;

      // 3️⃣ Eligibility Check
      const parentId = Number(parent.id);
      const maxAllowedLevel = await resolveLiveMaxLevel(parentId);
      if (level > maxAllowedLevel) continue;

      // 4️⃣ Duplicate Protection (The fix for the duplicates we deleted earlier)
      const exists = await strapi.documents("api::commission.commission").findFirst({
        filters: {
            earner: { id: parent.id },
            sourceUser: { id: childId },
            level: level,
            transaction_for: "LEVEL_INCOME",
        }
      });
      if (exists) continue;

      const amount = commissionConfig.level[`level_${level}`] ?? 0;
      if (amount <= 0) continue;

      await strapi.documents("api::commission.commission").create({
        data: {
          earner: parent.id,
          sourceUser: childId,
          level,
          amount,
          credit: amount,
          transaction_for: "LEVEL_INCOME",
          transaction_status: "SUCCESS",
          transaction_type: "CREDIT",
          publishedAt: new Date()
        },
      });
    }
},
  // async distributeLevelCommission(childId: number) {
  //   // 1️⃣ Load config once
  //   const commissionConfig = await strapi
  //     .documents("api::commission-level.commission-level")
  //     .findFirst({ populate: ["level"] });

  //   if (!commissionConfig?.level) return;

  //   // 2️⃣ Fetch FULL upline path ONCE
  //   const edges = await strapi
  //     .documents("api::affiliate-tree.affiliate-tree")
  //     .findMany({
  //       filters: { childUser: { id: childId } },
  //       populate: ["parentUser", "childUser"],
  //       sort: ["level:asc"],
  //     });

  //   // 3️⃣ Traverse ancestors
  //   for (const edge of edges) {
  //     const level = edge.level;
  //     const parent: any = edge.parentUser;
  //     const child: any = edge.childUser;
  //     console.log({ edge });
  //     if (!parent && !child) continue;
  //     //  console.log({edge})
  //     // ❌ Course check
  //     if (parent.affiliate_expired === true) continue;

  //     // 2️⃣ LEVEL 2-5 RESTRICTION: level_5_commission_window_expired
  //     // If TRUE, parent cannot earn from level 2 onwards.
  //     if (level > 1 && parent.level_5_commission_window_expired === true) continue;

  //     // 3️⃣ LEVEL 6-10 RESTRICTION: level_10_commission_window_expired
  //     // If TRUE, parent cannot earn from level 6 onwards.
  //     if (level > 5 && parent.level_10_commission_window_expired === true) continue;

  //     if (!parent.confirm_affiliate_payment || !child.confirm_affiliate_payment) continue;

  //     // await evaluateBonus(parent.id);
  //     // // 🔑 Resolve eligibility ONCE per parent
  //     // const maxAllowedLevel = await resolveUnlockedMaxLevel(parent.id);
  //     const maxAllowedLevel = await resolveLiveMaxLevel(parent.id);
  //     await backfillLevelCommission(parent.id, maxAllowedLevel);
  //     // const unlockedRules = await evaluateBonus(parent.id);
  //     // let maxAllowedLevel: any = null
  //     // if (unlockedRules.length) {
  //     //   maxAllowedLevel = await resolveUnlockedMaxLevel(parent.id);
  //     //   await backfillLevelCommission(parent.id, maxAllowedLevel);
  //     // }

  //     console.log({ maxAllowedLevel, level }, parent.id)

  //     if (level > maxAllowedLevel) continue;
  //     // ❌ Duplicate protection
  //     const exists = await strapi
  //       .documents("api::commission.commission")
  //       .findFirst({
  //         filters: {
  //           earner: { id: parent.id },
  //           sourceUser: { id: childId },
  //           level,
  //           transaction_for: "LEVEL_INCOME",
  //         },
  //       });

  //     if (exists) continue;

  //     // 💰 Amount
  //     const amount =
  //       commissionConfig.level[`level_${level}` as any] ?? 0;

  //     if (amount <= 0) continue;

  //     // ✅ Create commission
  //     await strapi.documents("api::commission.commission").create({
  //       data: {
  //         earner: parent.id,
  //         sourceUser: childId,
  //         level,
  //         amount,
  //         credit: amount,
  //         transaction_for: "LEVEL_INCOME",
  //         transaction_status: "SUCCESS",
  //         transaction_type: "CREDIT",
  //         publishedAt: new Date()
  //       },
  //     });
  //     // await this.syncUserWallet(parent.id, amount);
  //   }
  // },
//   async syncUserWallet(userId:any, creditAmount:any) {
//   const wallets = await strapi.documents('api::wallet.wallet').findMany({
//     filters: { user: { id: userId } },
//     limit: 1,
//   });

//   if (wallets.length > 0) {
//     const wallet:any = wallets[0];
//     await strapi.documents('api::wallet.wallet').update({
//       documentId: wallet.documentId,
//       data: {
//         total_balance: parseFloat(wallet.total_balance || 0) + creditAmount,
//         total_earned: parseFloat(wallet.total_earned || 0) + creditAmount,
//         last_transaction_at: new Date().toISOString(),
//       },
//     });
//   }
// },
async processAffiliateUpgrade(numericUserId: number) {
  console.log("id :", numericUserId);

  // 1. Find the user record using the numeric ID to get their documentId
  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: numericUserId },
  });
  console.log("Processing affiliate upgrade for user:", user);
  // if (!user || user.affiliateJoinedAt) {
  //   console.log("User not found or already processed.");
  //   return;
  // }

  // 2. Now use the Document Service with the resolved documentId
 await strapi
  .documents('plugin::users-permissions.user')
  .update({
    documentId: user.documentId,
    data: {
      affiliateJoinedAt: new Date(),
      level_5_commission_window_expiredAt: new Date(
        Date.now() + 35 * 24 * 60 * 60 * 1000
      ),
      confirm_affiliate_payment: true,
    },
  });

  // 3. Trigger distribution
  await strapi.service("api::affiliate.affiliate").distributeLevelCommission(user.id);
},

  async evaluateClubs(triggerUserId: number) {
    // 1️⃣ Get all uplines
    const uplines = await strapi
      .service("api::affiliate-tree.affiliate-tree")
      .getUplines(triggerUserId);

    if (!uplines.length) return;

    // 2️⃣ Load clubs once
    const clubs = await strapi
      .documents("api::club.club")
      .findMany();

    for (const upline of uplines) {
      // 3️⃣ Calculate REAL unique downline count
      const { count: totalReferrals } = await strapi
        .service("api::affiliate-tree.affiliate-tree")
        .getHierarchy(upline.id);
      console.log({ totalReferrals })
      for (const club of clubs) {
        // ❌ Not qualified
        if (totalReferrals < club.requiredReferrals) continue;

        // ❌ Already activated
        const exists = await strapi
          .db.query("api::user-club-status.user-club-status")
          .findOne({
            where: {
              user: upline.id,
              club: club.id,
            },
          });

        if (exists) continue;

        const activatedAt = new Date();
        const expiresAt = new Date();
        expiresAt.setMonth(
          expiresAt.getMonth() + club.durationMonths
        );

        await strapi
          .documents("api::user-club-status.user-club-status")
          .create({
            data: {
              user: upline.id,
              club: club.id,
              activatedAt,
              expiresAt,
              isActive: true,
            },
          });

        strapi.log.info(
          `🏆 Club unlocked → ${club.name} | User ${upline.id} | Referrals ${totalReferrals}`
        );
      }
    }
  },

  async distributeClubCommission(newUserId: number) {
    const now = new Date();

    // 1️⃣ Get ALL uplines with level
    const uplines = await strapi
      .service("api::affiliate-tree.affiliate-tree")
      .getUplines(newUserId);
    console.log({ uplines })
    if (!uplines.length) return;

    for (const upline of uplines) {

      /**
       * 2️⃣ BONUS RULE CHECK (DEPTH CONTROL)
       */
      const bonusStatus = await strapi
        .db.query("api::user-bonus-status.user-bonus-status")
        .findOne({
          where: {
            user: upline.id,
            isActive: true,
            // expiresAt: { $gt: now },
          },
          populate: ["bonusRule"],
        });
      console.log({ bonusStatus })
      if (!bonusStatus) continue;

      const { maxLevel } = bonusStatus.bonusRule;
      console.log({ maxLevel, upline })
      // ❌ depth restriction
      if (maxLevel && upline.level > maxLevel) {
        continue;
      }

      /**
       * 3️⃣ CLUB CHECK
       */
      const activeClubs = await strapi
        .db.query("api::user-club-status.user-club-status")
        .findMany({
          where: {
            user: upline.id,
            isActive: true,
            expiresAt: { $gt: now },
            activatedAt: { $lt: now },
          },
          populate: ["club"],
        });

      if (!activeClubs.length) continue;

      /**
       * 4️⃣ Pick HIGHEST club
       */
      const bestClub = activeClubs.sort(
        (a: any, b: any) =>
          b.club.requiredReferrals - a.club.requiredReferrals
      )[0];

      const amount = bestClub.club.amountPerAdmission;
      if (!amount || amount <= 0) continue;

      /**
       * 5️⃣ Duplicate protection
       */
      const exists = await strapi
        .db.query("api::commission.commission")
        .findOne({
          where: {
            earner: upline.id,
            sourceUser: newUserId,
            transaction_for: "CLUB_INCOME",
          },
        });

      if (exists) continue;

      /**
       * 6️⃣ Create commission
       */
      await strapi
        .documents("api::commission.commission")
        .create({
          data: {
            earner: upline.id,
            sourceUser: newUserId,
            amount,
            transaction_for: "CLUB_INCOME",
            status: "PENDING",
            earnedAt: now,
            publishedAt: new Date()
          },
        });

      strapi.log.info(
        `💰 Club commission → User ${upline.id} | Level ${upline.level} | Club ${bestClub.club.name}`
      );
    }
  }
});
