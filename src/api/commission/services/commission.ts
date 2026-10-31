/**
 * commission service
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreService('api::commission.commission');
import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::commission.commission",
  ({ strapi }) => ({

    /**
     * User → level-wise commission summary
     */
    async getUserLevelCommission(userId: number) {

  // 1️⃣ Fetch published level commissions + populate referredBy
  const commissions = await strapi
    .db.query("api::commission.commission")
    .findMany({
      where: {
        earner: userId,
        transaction_for: "LEVEL_INCOME",
        transaction_status: "SUCCESS",
        transaction_type: "CREDIT",
        publishedAt: { $notNull: true },
      },
      populate: {
       earner: {
        select: ["id", "username", "full_name", "created_at", "confirm_affiliate_payment"],
        populate: {
          referredBy: {
            select: ["id", "username", "full_name", "created_at", "confirm_affiliate_payment"],
          },
        },
      },
      },
    });
let earner = (commissions as any[])[0]?.earner ?? null;

// 2. FALLBACK: If commissions exist but earner is null, or if you just need the user info
if (!earner) {
  // console.log("⚠️ Earner null in commission, fetching directly from User table...");
  
  earner = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { id: userId },
    select: ["id", "username", "fullName", "createdAt", "confirm_affiliate_payment"], // Ensure these match your schema
    populate: ["referredBy"],
  });
}

// console.log({ earner });
// const referredBy = earner?.referredBy
//   ? {
//       id:       earner.referredBy.id,
//       username: earner.referredBy.username ?? null,
//       fullName: earner.referredBy.full_name ?? null,
//     }
//   : null;
// console.log({referredBy})

  // 2️⃣ Fetch commission-level config
  const [config] = await strapi
    .db.query("api::commission-level.commission-level")
    .findMany({
      populate: { level: true },
    });

  const levelConfig = config?.level || {};

  // 3️⃣ Extract referredBy once from the first commission that has it
  // const rawRb = (commissions as any[]).find((c) => c.referredBy)?.referredBy ?? null;
  // const referredBy = rawRb
  //   ? { id: rawRb.id, username: rawRb.username ?? null, fullName: rawRb.full_name ?? null }
  //   : null;

  // 4️⃣ Aggregate credit per level
  const earnedMap = new Map<number, number>();
  for (const c of commissions as any[]) {
    const level = Number(c.level);
    earnedMap.set(level, (earnedMap.get(level) || 0) + Number(c.credit || 0));
  }

  // 5️⃣ Build levels 1 → 10
  const levels = Array.from({ length: 10 }, (_, i) => {
    const level = i + 1;
    return {
      level,
      perLevelAmount: Number(levelConfig[`level_${level}`]) || 0,
      totalEarned:    earnedMap.get(level) || 0,
    };
  });

  return {
    userId,
    totalCommission: levels.reduce((sum, l) => sum + l.totalEarned, 0),
    levels,
    earner
  };
},
// async getUserLevelCommission(userId: number) {

//   // 1️⃣ Fetch ONLY published level commissions
//   const commissions = await strapi
//     .db.query("api::commission.commission")
//     .findMany({
//       where: {
//         earner: userId,
//         transaction_for: "LEVEL_INCOME",
//         transaction_status: "SUCCESS",
//         transaction_type: "CREDIT",
//         publishedAt: { $notNull: true }, // 🔥 IMPORTANT
//       },
//       populate: {
//         referredBy: {
//           select: ["id", "username", "full_name"],
//         },
//       },
//     });

//   // 2️⃣ Fetch commission-level config
//   const [config] = await strapi
//     .db.query("api::commission-level.commission-level")
//     .findMany({
//       populate: { level: true },
//     });

//   const levelConfig = config?.level || {};

//   // 3️⃣ Aggregate earned commission per level
//   const earnedMap = new Map<number, number>();

//   for (const c of commissions as any[]) {
//     const level = Number(c.level);
//     earnedMap.set(
//       level,
//       (earnedMap.get(level) || 0) + Number(c.credit || 0)
//     );
//   }

//   // 4️⃣ Build ALL levels (1 → 10)
//   const levels = Array.from({ length: 10 }, (_, i) => {
//     const level = i + 1;

//     return {
//       level,
//       perLevelAmount: Number(levelConfig[`level_${level}`]) || 0,
//       totalEarned: earnedMap.get(level) || 0,
//     };
//   });

//   return {
//     userId,
//     totalCommission: levels.reduce(
//       (sum, l) => sum + l.totalEarned,
//       0
//     ),
//     levels,
//   };
// },
     
     async getUserClubCommission(userId: number) {

      // 1️⃣ Club rules (CONFIG)
      const clubs = await strapi.db
        .query("api::club.club")
        .findMany({
          where: { publishedAt: { $notNull: true } },
          orderBy: { requiredReferrals: "asc" },
        });

      // 2️⃣ Earned club commissions
      const commissions = await strapi.db
        .query("api::commission.commission")
        .findMany({
          where: {
            earner: { id: { $eq: userId } },
              transaction_for: "CLUB_INCOME",
        transaction_status: "SUCCESS",
        transaction_type: "CREDIT",
            publishedAt: { $notNull: true },
          },
          populate: { club: true },
        });

      const earnedMap = new Map<number, number>();

      for (const c of commissions as any[]) {
        const clubId = c.club?.id;
        if (!clubId) continue;

        earnedMap.set(
          clubId,
          (earnedMap.get(clubId) || 0) + Number(c.amount || 0)
        );
      }

      // 3️⃣ LEVEL-style response
      const levels = clubs.map((club: any) => ({
        level: club.name, // CLUB_50, CLUB_250
        requiredReferrals: club.requiredReferrals,
        perLevelAmount: Number(club.amountPerAdmission || 0),
        durationMonths: club.durationMonths,
        totalEarned: earnedMap.get(club.id) || 0,
      }));

      return {
        userId,
        totalCommission: levels.reduce(
          (sum, l) => sum + l.totalEarned,
          0
        ),
        levels,
      };
    },

async getMyHistory(userId: number) {
  // 1. Fetch both datasets in parallel for better performance
  const [transactions, payouts] = await Promise.all([
    strapi.db.query("api::commission.commission").findMany({
      where: { earner: userId, publishedAt: { $notNull: true } },
      populate: { sourceUser: { select: ["id", "username"] } },
    }),
    strapi.db.query("api::payout.payout").findMany({
      where: { user: userId, publishedAt: { $notNull: true } },
    }),
  ]);

  // 2. Map Transactions
  const normalizedTransactions = transactions.map((t) => ({
    id: t.id,
    entity: "transaction-history",
    type: t.type,
    direction: t.direction ?? "CREDIT",
    amount: Number(t.amount || 0),
    sourceUser: t.sourceUser || null,
    status: t.status || "COMPLETED",
    reference: t.reference || null,
    createdAt: t.createdAt,
  }));

  // 3. Map Payouts
  const normalizedPayouts = payouts.map((p) => ({
    id: p.id,
    entity: "payout",
    type: p.transactionType ?? "WITHDRAWAL",
    direction: "DEBIT", // Payouts are usually always debits
    amount: Number(p.amount || 0),
    sourceUser: null,
    status: p.status || "PENDING",
    reference: p.referenceId || null, // Map referenceId to reference
    createdAt: p.createdAt,
  }));

  // 4. Merge and Sort
  const merged = [...normalizedTransactions, ...normalizedPayouts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    userId,
    totalRecords: merged.length,
    data: merged,
  };
},
  async getUserCommissionSummary(userId: number) {
      const commissions = await strapi.db
        .query("api::commission.commission")
        .findMany({
          where: {
            earner: userId,
            publishedAt: { $notNull: true },
          },
          orderBy: { createdAt: "desc" },
        });

      return {
        userId,
        totalCommission: commissions.reduce(
          (sum, c: any) => sum + Number(c.amount || 0),
          0
        ),
        records: commissions,
      };
    },
  async getChartData(year: string, userId: number) {
  // Use simple date strings for the database query
  const startDate = `${year}-01-01 00:00:00`;
  const endDate = `${year}-12-31 23:59:59`;

  const results = await strapi.db.query("api::commission.commission").findMany({
    where: {
      earner: userId,
      // Using a direct query ensures we hit the database columns correctly
      earnedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    },
    // Ensure 'credit', 'created_at', and 'transaction_for' are selected
    select: ["credit", "created_at", "transaction_for"],
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  // Initialize the array
  const stats = months.map((m) => ({ month: m, LEVEL: 0, CLUB: 0 }));

  if (!results || results.length === 0) {
    return stats;
  }

  results.forEach((item: any) => {
    // Check both camelCase and snake_case just in case of migration naming differences
    const rawDate = item.created_at || item.created_at;
    const amount = item.credit;
    const type = item.transaction_for?.toUpperCase();

    if (rawDate && type) {
      const date = new Date(rawDate);
      const monthIndex = date.getUTCMonth();

      if (stats[monthIndex] && (type === "LEVEL_INCOME" || type === "CLUB_INCOME")) {
        // Use Number() to convert the biginteger string from the DB
        stats[monthIndex][type as "LEVEL_INCOME" | "CLUB_INCOME"] += Number(amount || 0);
      }
    }
  });

  return stats;
},
// async getChartData(year, userId) {
//     const startDate = `${year}-01-01T00:00:00.000Z`;
//     const endDate = `${year}-12-31T23:59:59.999Z`;
// console.log("--- DEBUG START ---");
//     console.log("Params Received:", { userId, year });
//     const results = await strapi.entityService.findMany('api::commission.commission', {
//       filters: {
//         $and: [
//           // Use the EXACT names from your schema.json: "earnedAt" and "earner"
//           { earnedAt: { $gte: startDate } },
//           { earnedAt: { $lte: endDate } },
//           { earner: { id: userId } },
//         ],
//       },
//       // Ensure this matches schema.json exactly
//       fields: ['amount', 'earnedAt', 'type'], 
//       // Use 'preview' if you want to see Drafts, 'live' for only Published
//       publicationState: 'preview', 
//     });
// console.log(`Found ${results.length} records for user ${userId} in ${year}`);
//     if (results.length > 0) console.log('First record sample:', results[0]);
//     // Initialize 12 months
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const stats = months.map(m => ({ month: m, LEVEL: 0, CLUB: 0 }));

//     results.forEach(item => {
//       // Logic check: if SQL used earned_at, Strapi's item will have item.earnedAt
//       if (item.earnedAt && item.type) {
//         const date = new Date(item.earnedAt);
//         const monthIndex = date.getUTCMonth();
        
//         const typeKey = item.type.toUpperCase(); // Ensure it matches 'LEVEL' or 'CLUB'

//         if (stats[monthIndex] && (typeKey === 'LEVEL' || typeKey === 'CLUB')) {
//           // BigInt comes as a string, convert to Number for addition
//           stats[monthIndex][typeKey] += Number(item.amount || 0);
//         }
//       }
//     });

//     return stats;
//   }

// async getUserWalletSummary(userId:any) {
//       console.log({ userId }, ">>>>>>>>>")
//       // 1. Fetch all successful transactions for the earner
//       const transactions = await strapi.documents("api::commission.commission").findMany({
//         filters: {
//           earner: { id: userId },
//           transaction_status: "SUCCESS",
//         },
//         // Ensure we fetch the fields shown in your screenshot
//         fields: ["credit", "debit", "tramount", "transaction_for", "transaction_type"],
//       });

//       // 2. Initialize aggregation object
//       const summary = {
//         grand_total: {
//           total_credit: 0,
//           total_debit: 0,
//           wallet_balance: 0, // credit - debit
//           total_tramount: 0,
//         },
//         by_category: {
//           LEVEL_INCOME: { credit: 0, debit: 0, count: 0 },
//           CLUB_INCOME: { credit: 0, debit: 0, count: 0 },
//           WITHDRAW: { credit: 0, debit: 0, count: 0 },
//           DEDUCT: { credit: 0, debit: 0, count: 0 },
//         },
//       };

//       // 3. Process transactions
//       transactions.forEach((tx:any) => {
//         const credit = parseFloat(tx.credit || 0);
//         const debit = parseFloat(tx.debit || 0);
//         const tramount = parseFloat(tx.tramount || 0);
//         const category = tx.transaction_for;

//         // Update Grand Totals
//         summary.grand_total.total_credit += credit;
//         summary.grand_total.total_debit += debit;
//         summary.grand_total.total_tramount += tramount;

//         // Update Categorized Totals
//         if (summary.by_category[category]) {
//           summary.by_category[category].credit += credit;
//           summary.by_category[category].debit += debit;
//           summary.by_category[category].count += 1;
//         }
//       });

//       // 4. Final calculation for current spendable balance
//       summary.grand_total.wallet_balance = 
//         summary.grand_total.total_credit - summary.grand_total.total_debit;

//       return summary;
//     },

async getUserWalletSummary(userId: any) {
  const isUsername = userId.trim().startsWith('EC');

const filters = isUsername 
  ? { earner: { username: { $eq: userId.trim() } } } 
  : { earner: { id: { $eq: Number(userId.trim()) } } };

const transactions = await strapi.documents("api::commission.commission").findMany({
  filters: {
    ...filters,
    transaction_status: "SUCCESS",
  },
  fields: ["credit", "debit", "transaction_for"],
  // Pass the fields directly if the nested object is throwing errors
  populate: {
    earner: {
      fields: ["username", "documentId", "fullName"] as any
    }
  }
});
  const summary = {
    grand_total: {
      total_earned: 0,   
      total_debit: 0,    
      total_deduct: 0,   
      wallet_balance: 0, 
    },
    by_category: {
      LEVEL_INCOME: { credit: 0, debit: 0, net: 0, count: 0 },
      CLUB_INCOME: { credit: 0, debit: 0, net: 0, count: 0 },
      WITHDRAW: { credit: 0, debit: 0, count: 0 },
      DEDUCT: { credit: 0, debit: 0, count: 0 },
    },
    earner: {
      

    }
  };

  let totalGrossIncome = 0;

  transactions.forEach((tx: any) => {
    const credit = parseFloat(tx.credit || 0);
    const debit = parseFloat(tx.debit || 0);
    const category = tx.transaction_for;
 summary.earner = tx.earner
    // 1. Update basic category stats
    if (summary.by_category[category]) {
      summary.by_category[category].credit += credit;
      summary.by_category[category].debit += debit;
      summary.by_category[category].count += 1;
    }

    // 2. Logic for Grand Totals
    if (category === "DEDUCT") {
      summary.grand_total.total_deduct += debit;
    } else if (category === "WITHDRAW") {
      summary.grand_total.total_debit += debit;
    } else {
      totalGrossIncome += credit;
    }
  });

  // 3. Category Net Calculation
  // We apply the global deductions to the LEVEL_INCOME net for your specific display
  summary.by_category.LEVEL_INCOME.net = 
    summary.by_category.LEVEL_INCOME.credit - summary.grand_total.total_deduct;

  summary.by_category.CLUB_INCOME.net = 
    summary.by_category.CLUB_INCOME.credit;

  // 4. Final Grand Totals
  summary.grand_total.total_earned = totalGrossIncome - summary.grand_total.total_deduct;
  summary.grand_total.wallet_balance = summary.grand_total.total_earned - summary.grand_total.total_debit;
 
  return summary;
},

// async getGlobalWalletSummary() {
//   try {
//     const knex = strapi.db.connection;
    
//     // ✅ Use the correct table name (usually 'commissions')
//     // We run these in parallel for better performance
//     const [incomeResult, deductResult, payoutResult] = await Promise.all([
//       knex('commissions')
//         .where({ transaction_status: 'SUCCESS' })
//         .whereNotIn('transaction_for', ['DEDUCT', 'WITHDRAW'])
//         .sum({ total: 'credit' })
//         .first(),

//       knex('commissions')
//         .where({ transaction_status: 'SUCCESS', transaction_for: 'DEDUCT' })
//         .sum({ total: 'debit' })
//         .first(),

//       knex('commissions')
//         .where({ transaction_status: 'SUCCESS', transaction_for: 'WITHDRAW' })
//         .sum({ total: 'debit' })
//         .first()
//     ]);

//     const totalGross = Number(incomeResult?.total || 0);
//     const totalDeduct = Number(deductResult?.total || 0);
//     const totalPayout = Number(payoutResult?.total || 0);

//     const totalEarned = totalGross - totalDeduct;
//     const walletBalance = totalEarned - totalPayout;

//     return {
//       scope: "GLOBAL_SYSTEM_OVERVIEW",
//       grand_total: {
//         system_gross: totalGross,
//         total_earned: totalEarned,
//         total_deduct: totalDeduct,
//         total_debit: totalPayout,
//         wallet_balance: walletBalance,
//       },
//     };
//   } catch (error) {
//     strapi.log.error("Knex SQL Error:", error); // Check terminal for the real error message
//     throw new Error("Database query failed");
//   }
// }
// async getGlobalWalletSummary() {
//   try {
//     const knex = strapi.db.connection;

//     // 1. Gross Earnings
//     const incomeResult = await knex('commissions')
//       .where({ transaction_status: 'SUCCESS' })
//       .whereNotIn('transaction_for', ['DEDUCT', 'WITHDRAW'])
//       .sum({ total: 'credit' })
//       .first();

//     // 2. Total Deduction
//     const deductResult = await knex('commissions')
//       .where({ transaction_status: 'SUCCESS', transaction_for: 'DEDUCT' })
//       .sum({ total: 'debit' })
//       .first();

//     // 3. Total Withdrawal
//     const payoutResult = await knex('commissions')
//       .where({ transaction_status: 'SUCCESS', transaction_for: 'WITHDRAW' })
//       .sum({ total: 'debit' })
//       .first();

//     const totalGross = Number(incomeResult?.total || 0);
//     const totalDeduct = Number(deductResult?.total || 0);
//     const totalPayout = Number(payoutResult?.total || 0);

//     const totalEarned = totalGross - totalDeduct;
//     const walletBalance = totalEarned - totalPayout;

//     return {
//       scope: "GLOBAL_SYSTEM_OVERVIEW",
//       grand_total: {
//         system_gross: totalGross,
//         total_earned: totalEarned,
//         total_deduct: totalDeduct,
//         total_debit: totalPayout,
//         wallet_balance: walletBalance,
//       },
//     };

//   } catch (error) {
//     strapi.log.error("Global Wallet Summary Error:", error);
//     throw new Error("Failed to fetch global wallet summary");
//   }
// }

async getGlobalWalletSummary() {
  try {
    const knex = strapi.db.connection;

    const [incomeResult, deductResult, payoutResult] = await Promise.all([
      knex('commissions')
        .where({ transaction_status: 'SUCCESS' })
        .whereNotIn('transaction_for', ['DEDUCT', 'WITHDRAW'])
        .sum('credit as total')
        .first(),

      knex('commissions')
        .where({ transaction_status: 'SUCCESS', transaction_for: 'DEDUCT' })
        .sum('debit as total')
        .first(),

      knex('commissions')
        .where({ transaction_status: 'SUCCESS', transaction_for: 'WITHDRAW' })
        .sum('debit as total')
        .first(),
    ]);

    // MySQL returns sum as string, PostgreSQL as number — handle both
    const totalGross  = parseFloat(incomeResult?.total  ?? 0) || 0;
    const totalDeduct = parseFloat(deductResult?.total  ?? 0) || 0;
    const totalPayout = parseFloat(payoutResult?.total  ?? 0) || 0;

    const totalEarned   = totalGross - totalDeduct;
    const walletBalance = totalEarned - totalPayout;

    return {
      scope: "GLOBAL_SYSTEM_OVERVIEW",
      grand_total: {
        system_gross:   totalGross,
        total_earned:   totalEarned,
        total_deduct:   totalDeduct,
        total_debit:    totalPayout,
        wallet_balance: walletBalance,
      },
      // by_category: {
      //       LEVEL_INCOME: {
      //           "credit": 0,
      //           "debit": 0,
      //           "net": 0,
      //           "count": 339
      //       },
      //       CLUB_INCOME: {
      //           "credit": 0,
      //           "debit": 0,
      //           "net": 0,
      //           "count": 0
      //       },
      //       WITHDRAW: {
      //           "credit": 0,
      //           "debit": 0,
      //           "count": 0
      //       },
      //       DEDUCT: {
      //           "credit": 0,
      //           "debit": 0,
      //           "count": 0
      //       }
      //   }
    };
  } catch (error) {
    strapi.log.error("Knex SQL Error:", error);
    throw new Error("Database query failed");
  }
},

// src/api/commission/services/commission.js

// src/api/commission/services/commission.ts

  // async getUsersGlobalSummary(params: { 
  //   page?: string | number; 
  //   pageSize?: string | number;
  //   sort?: string; 
  // }) {
  //   const page = Number(params.page || 1);
  //   const pageSize = Number(params.pageSize || 10);
  //   const limit = pageSize;
  //   const offset = (page - 1) * limit;

  //   // Default to oldest users first (asc) or newest (desc)
  //   const sortParam = params.sort || 'createdAt:asc';
  //   const [sortField, sortOrder] = sortParam.split(':');

  //   const knex = strapi.db.connection;

  //   const query = knex('commissions as c')
  //     .leftJoin('commissions_earner_lnk as cel', 'c.id', 'cel.commission_id')
  //     .leftJoin('up_users as u', 'cel.user_id', 'u.id')
  //     .select(
  //       'u.username',
  //       'u.full_name as fullName',
  //       'u.id as userId',
  //       'u.created_at as createdAt' // 1. Select the creation date
  //     )
  //     .sum('c.credit as totalCredit')
  //     .sum({
  //       levelIncome: knex.raw("CASE WHEN c.transaction_for = 'LEVEL_INCOME' THEN c.credit ELSE 0 END")
  //     })
  //     .sum({
  //       clubIncome: knex.raw("CASE WHEN c.transaction_for = 'CLUB_INCOME' THEN c.credit ELSE 0 END")
  //     })
  //     .where('c.transaction_status', 'SUCCESS')
  //     .where('c.transaction_type', 'CREDIT')
  //     .whereIn('c.transaction_for', ['LEVEL_INCOME', 'CLUB_INCOME'])
  //     // 2. IMPORTANT: Must group by created_at to allow sorting/selecting it
  //     .groupBy('u.id', 'u.username', 'u.full_name', 'u.created_at');

  //   // 3. Mapping for Sorting
  //   const sortMapping: Record<string, string> = {
  //     username: 'u.username',
  //     fullName: 'u.full_name',
  //     totalCredit: 'totalCredit',
  //     levelIncome: 'levelIncome',
  //     clubIncome: 'clubIncome',
  //     createdAt: 'u.created_at' // Map frontend 'createdAt' to DB 'u.created_at'
  //   };

  //   const sqlSortField = 'u.created_at';
  //   const sqlSortOrder = sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';

  //   query.orderBy(sqlSortField, sqlSortOrder);

  //   const results = await query.limit(limit).offset(offset);

  //   // Count logic stays the same
  //   const countResult = await knex('commissions as c')
  //     .leftJoin('commissions_earner_lnk as cel', 'c.id', 'cel.commission_id')
  //     .where('c.transaction_status', 'SUCCESS')
  //     .countDistinct('cel.user_id as total');

  //   const total = parseInt(countResult[0]?.total?.toString() ?? "0", 10);

  //   return {
  //     data: results,
  //     meta: {
  //       pagination: { page, pageSize, pageCount: Math.ceil(total / pageSize), total },
  //     },
  //   };
  // },
  // src/api/commission/services/commission.ts

// src/api/commission/services/commission.ts

async getUsersGlobalSummary(params: { page, pageSize, sort, search }) {
    const { page, pageSize, sort, search } = params;
    const knex = strapi.db.connection;

    try {
        const query = knex('commissions as c')
            // Note: If this fails, try 'commissions_earner_links' (Strapi v5 standard)
            .join('commissions_earner_lnk as cel', 'c.id', 'cel.commission_id')
            .join('up_users as u', 'cel.user_id', 'u.id')
            .select(
                'u.id as userId',
                'u.username',
                'u.full_name as fullName',
                'u.created_at as createdAt'
            )
            // ✅ Fix: Use knex.raw inside select for complex sums
            .select(knex.raw('SUM(c.credit) as "totalCredit"'))
            .select(knex.raw("SUM(CASE WHEN c.transaction_for = 'LEVEL_INCOME' THEN c.credit ELSE 0 END) as \"levelIncome\""))
            .select(knex.raw("SUM(CASE WHEN c.transaction_for = 'CLUB_INCOME' THEN c.credit ELSE 0 END) as \"clubIncome\""))
            .where('c.transaction_status', 'SUCCESS')
            .where('c.transaction_type', 'CREDIT');

        // Apply Search
        if (search && search.trim() !== "") {
            const searchTerm = `%${search.trim()}%`;
            query.andWhere((builder) => {
                builder.where('u.username', 'ILIKE', searchTerm)
                       .orWhere('u.full_name', 'ILIKE', searchTerm);
            });
        }

        query.groupBy('u.id', 'u.username', 'u.full_name', 'u.created_at');

        // Execute Data Query
        const results = await query
            .limit(Number(pageSize))
            .offset((Number(page) - 1) * Number(pageSize))
            .orderBy('u.created_at', 'desc');

        // ✅ Separate Count Query for Meta
        const countQuery = knex('commissions as c')
            .join('commissions_earner_lnk as cel', 'c.id', 'cel.commission_id')
            .join('up_users as u', 'cel.user_id', 'u.id')
            .where('c.transaction_status', 'SUCCESS')
            .where('c.transaction_type', 'CREDIT');

        if (search && search.trim() !== "") {
            const searchTerm = `%${search.trim()}%`;
            countQuery.andWhere((builder) => {
                builder.where('u.username', 'ILIKE', searchTerm)
                       .orWhere('u.full_name', 'ILIKE', searchTerm);
            });
        }

        const countResult = await countQuery.countDistinct('u.id as total');
        const total = parseInt(countResult[0]?.total?.toString() || "0", 10);

        return { 
            data: results, 
            meta: { 
                pagination: { 
                    page: Number(page), 
                    pageSize: Number(pageSize), 
                    total 
                } 
            } 
        };
    } catch (error) {
        strapi.log.error('SQL Error in getUsersGlobalSummary:', error);
        throw error; // Let the controller handle the 500 but log the real SQL error
    }
}
  })
  
);
