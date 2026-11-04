export function calculateBonusAmount(
  levelConfig: any,
  maxLevel: number
): number {
  let total = 0;
  for (let i = 1; i <= maxLevel; i++) {
    total += levelConfig[`level_${i}`] ?? 0;
  }
  return total;
}
export async function evaluateBonus(userId: any): Promise<number[]> {
  const unlockedRuleIds: number[] = [];

  const user = await strapi
    .db.query("plugin::users-permissions.user")
    .findOne({ where: { id: userId } });

  if (!user?.affiliateJoinedAt) return unlockedRuleIds;

  const daysSinceJoin =
    (Date.now() - new Date(user.affiliateJoinedAt).getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysSinceJoin > 35) return unlockedRuleIds;

  const rules: any = await strapi
    .documents("api::bonus-rule.bonus-rule")
    .findMany();

  for (const rule of rules) {
    if (user.directReferralCount >= rule.directRequired) {
      const exists = await strapi
        .documents("api::user-bonus-status.user-bonus-status")
        .findFirst({
          filters: { user: userId, bonusRule: rule.id },
        });

      if (!exists) {
        await strapi
          .documents("api::user-bonus-status.user-bonus-status")
          .create({
            data: {
              user: userId,
              bonusRule: rule.id,
              isActive: true,
              activatedAt: new Date(),
              expiresAt: new Date(
                Date.now() + rule.validDays * 86400000
              ),
            },
          });
        if (rule.directRequired === 3 || rule.name === "DIRECT_3") {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + (rule.validDays || 35));

          await strapi.db.query("plugin::users-permissions.user").update({
            where: { id: userId },
            data: {
              level_10_commission_window_expired: false,
              level_10_commission_window_expiredAt: expiryDate,
            },
          });
          
          console.log(`✅ User ${userId} updated: Level 10 Window extended for 35 days.`);
        }
        unlockedRuleIds.push(rule.id);
      }
    }
  }

  return unlockedRuleIds;
}

export async function resolveUnlockedMaxLevel(
  userId: number
): Promise<number> {
  const bonuses = await strapi
    .documents("api::user-bonus-status.user-bonus-status")
    .findMany({
      filters: {
        user: { id: userId },
        isActive: true,
        // expiresAt: { $gt: new Date() },
      },
      populate: ["bonusRule"],
    });

  if (!bonuses.length) return 1;

  // Pick highest bonus rule by directRequired
  const bestBonus = bonuses
    .filter(b => b.bonusRule)
    .sort(
      (a: any, b: any) =>
        (b.bonusRule.directRequired || 0) -
        (a.bonusRule.directRequired || 0)
    )[0];

  return bestBonus?.bonusRule?.maxLevel ?? 1;
}
// export async function resolveLiveMaxLevel(userId: number): Promise<number> {
//   // 1. Get the count of valid direct referrals
//   const directReferralCount = await strapi.db.query("plugin::users-permissions.user").count({
//     where: {
//       referredBy: userId,
//       confirm_affiliate_payment: true, // Only count paid referrals
//     },
//   });

//   // 2. Fetch bonus rules sorted by difficulty
//   const rules = await strapi.documents("api::bonus-rule.bonus-rule").findMany({
//     sort: { directRequired: 'desc' }
//   });

//   // 3. Find the first rule the user qualifies for
//   const matchingRule = rules.find(rule => directReferralCount >= rule.directRequired);
// // const matchingRule = rules.find(rule => directReferralCount >= rule.directRequired);

//   // 4. SPECIAL CASE: Update User Window if they have exactly or more than 3 referrals
//   // We check if the matching rule is the one that grants Level 10 (Direct 3)
//   if (matchingRule && (matchingRule.directRequired === 3 || matchingRule.name === "DIRECT_3")) {
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + (matchingRule.validDays || 35));

//     await strapi.db.query("plugin::users-permissions.user").update({
//       where: { id: userId },
//       data: {
//         level_10_commission_window_expired: false,
//         level_10_commission_window_expiredAt: expiryDate,
//       },
//     });
    
//     console.log(`✅ User ${userId} updated: Level 10 Window extended to ${expiryDate.toISOString()}`);
//   }
//   // Return maxLevel from rule, or default to 1
//   return matchingRule?.maxLevel ?? 1;
// }
export async function resolveLiveMaxLevel(userId: number): Promise<number> {
  const user = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { id: userId },
    select: ['id', 'level_10_commission_window_expired'] // Check current status
  });

  const directReferralCount = await strapi.db.query("plugin::users-permissions.user").count({
    where: {
      referredBy: userId,
      confirm_affiliate_payment: true,
    },
  });

  const rules = await strapi.documents("api::bonus-rule.bonus-rule").findMany({
    sort: { directRequired: 'desc' }
  });

  const matchingRule = rules.find(rule => directReferralCount >= rule.directRequired);

  // Only update if they hit the requirement AND they aren't already active
  if (matchingRule?.directRequired === 3 && user?.level_10_commission_window_expired !== false) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (matchingRule.validDays || 35));

    await strapi.db.query("plugin::users-permissions.user").update({
      where: { id: userId },
      data: {
        level_10_commission_window_expired: false,
        level_10_commission_window_expiredAt: expiryDate,
      },
    });
  }
  
  return matchingRule?.maxLevel ?? 1;
}
// Direct-7 route: this many paid direct referrals make a user eligible to earn without buying a course.
// Kept separate from confirm_affiliate_payment, which also unlocks paid content such as webinars.
export const DIRECT_ROUTE_REQUIRED = 7;

export async function isDirectRouteEligible(userId: number): Promise<boolean> {
  const paidDirects = await strapi.db.query("plugin::users-permissions.user").count({
    where: {
      referredBy: userId,
      confirm_affiliate_payment: true,
    },
  });

  return paidDirects >= DIRECT_ROUTE_REQUIRED;
}

export async function backfillLevelCommission(
  userId: number,
  maxLevel: number
) {
  const commissionConfig = await strapi
    .documents("api::commission-level.commission-level")
    .findFirst({ populate: ["level"] });

  if (!commissionConfig?.level) return;

  // 🔁 Get ALL downlines (past + future)
  const edges = await strapi
    .documents("api::affiliate-tree.affiliate-tree")
    .findMany({
      filters: { parentUser: { id: userId } },
      populate: ["childUser"],
    });

  for (const edge of edges) {
    const level = edge.level;
    const childId = edge.childUser?.id;

    if (!childId || level > maxLevel) continue;

    const exists = await strapi
      .documents("api::commission.commission")
      .findFirst({
        filters: {
          earner: { id: userId },
          sourceUser: { id: childId },
          level,
          transaction_for: "LEVEL_INCOME",
        },
      });

    if (exists) continue;

    const amount =
      commissionConfig.level[`level_${level}`] ?? 0;

    if (amount <= 0) continue;

    await strapi.documents("api::commission.commission").create({
      data: {
        earner: userId,
        sourceUser: childId,
        level,
        amount,
        credit: amount,
        transaction_for: "LEVEL_INCOME",
        transaction_status: "SUCCESS",
         transaction_type: "CREDIT",
        isBackfilled: true,
        publishedAt: new Date()
      },
    });
  }
}

export async function resolveMaxCommissionLevel(userId: number): Promise<number> {
  const user = await strapi
    .db.query("plugin::users-permissions.user")
    .findOne({ where: { id: userId } });

  if (!user?.affiliateJoinedAt) return 1;

  const days =
    (Date.now() - new Date(user.affiliateJoinedAt).getTime()) /
    (1000 * 60 * 60 * 24);

  if (days > 35) return 1;

  const rules = await strapi
    .documents("api::bonus-rule.bonus-rule")
    .findMany({
      sort: ["directRequired:desc"],
    });

  for (const rule of rules) {
    if (user.directReferralCount >= rule.directRequired) {
      return rule.maxLevel;
    }
  }

  return 1;
}

export async function resolveActiveBonus(userId: any) {
  const bonus = await strapi
    .documents("api::user-bonus-status.user-bonus-status")
    .findFirst({
      filters: {
        user: { id: userId },
        isActive: true,

        // expiresAt: { $gt: new Date() },
      },
      populate: ["bonusRule"],
    });

  return bonus
    ? {
      maxLevel: bonus.bonusRule.maxLevel, // 5 or 10
      ruleId: bonus.bonusRule.id,
    }
    : null;
}
