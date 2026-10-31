// import { pgPool } from "./config/postgres";

// async function migrateCommissions() {
//   const { rows: sourceRecords } = await pgPool.query(`
//     SELECT id, regno, remark, transdate 
//     FROM member_accounts 
//     WHERE remark ILIKE '%Level Commission%'
//   `);

//   console.log(`Found ${sourceRecords.length} records to migrate.`);

//   for (const row of sourceRecords) {
//     try {
//       const childCodeMatch = row.remark.match(/from\s+([A-Z0-9]+)/i);
//       const levelMatch = row.remark.match(/level\s*(\d+)/i);

//       if (!childCodeMatch || !levelMatch) continue;

//       const sourceUserRegno = childCodeMatch[1];
//       const levelNum = parseInt(levelMatch[1], 10);
//       const originalDate = row.transdate; // Using the legacy transdate

//       // Level-wise Amount Logic
//       let amount = 0;
//       if (levelNum === 1) amount = 3500;
//       else if (levelNum === 2) amount = 2500;
//       else if (levelNum === 3) amount = 1500;
//       else if (levelNum === 4) amount = 1000;
//       else if (levelNum === 5) amount = 750;
//       else if (levelNum === 6) amount = 750;
//       else if (levelNum === 7) amount = 500;
//       else if (levelNum === 8) amount = 500;
//       else if (levelNum === 9) amount = 500;
//       else if (levelNum === 10) amount = 1000;


//       // Resolve IDs
//       const { rows: users } = await pgPool.query(`
//         SELECT id, regno, username FROM up_users 
//         WHERE regno = '${row.regno}' OR username = '${sourceUserRegno}' OR regno = '${sourceUserRegno}'
//       `);

//       const earner = users.find((u: any) => u.regno == row.regno);
//       const sourceUser = users.find((u: any) => u.username == sourceUserRegno || u.regno == sourceUserRegno);

//       if (earner && sourceUser) {
//         // Insert into Main Commissions Table using transdate for ALL timestamp fields
//         const res = await pgPool.query(`
//           INSERT INTO commissions (
//             type, 
//             level, 
//             amount, 
//             earned_at, 
//             published_at, 
//             created_at, 
//             updated_at
//           )
//           VALUES ($1, $2, $3, $4, $4, $4, $4)
//           RETURNING id
//         `, ['LEVEL', levelNum, amount, originalDate]);

//         const commissionId = res.rows[0].id;

//         // Link to Earner and Source User
//         await pgPool.query(`
//           INSERT INTO commissions_earner_lnk (commission_id, user_id)
//           VALUES ($1, $2)
//         `, [commissionId, earner.id]);

//         await pgPool.query(`
//           INSERT INTO commissions_source_user_lnk (commission_id, user_id)
//           VALUES ($1, $2)
//         `, [commissionId, sourceUser.id]);

//         console.log(`✅ [ID:${row.id}] Migrated to Commission ID:${commissionId} | Date: ${originalDate}`);
//       }
//     } catch (err: any) {
//       console.error(`❌ Error on legacy ID ${row.id}:`, err.message);
//     }
//   }

//   console.log("🏁 Commission migration finished");
//   process.exit(0);
// }

// migrateCommissions().catch(console.error);

// import { pgPool } from "./config/postgres";

// async function migrateCommissions() {
//   const { rows: sourceRecords } = await pgPool.query(`
//     SELECT *
//     FROM member_accounts 
//   `);

//   console.log(`Found ${sourceRecords.length} records to migrate.`);

//   for (const row of sourceRecords) {
//     try {
//       // 1. Regex Logic: Handles "level6" and "level 6"
//       // const childCodeMatch = row.remark.match(/from\s+([A-Z0-9]+)/i);
//       // const levelMatch = row.remark.match(/level\s*(\d+)/i);

//       // if (!childCodeMatch || !levelMatch) {
//       //   console.warn(`⚠️ Skipping row ${row.id}: Could not parse remark format.`);
//       //   continue;
//       // }

//       // const sourceUserRegno = childCodeMatch[1] ?? null;
//       // const levelNum = parseInt(levelMatch[1], 10) ?? null;

//       const childCodeMatch = row.remark ? row.remark.match(/from\s+([A-Z0-9]+)/i) : null;
//       const levelMatch = row.remark ? row.remark.match(/level\s*(\d+)/i) : null;

//       const sourceUserRegno = childCodeMatch?.[1] || null;
//       const levelNum = levelMatch ? parseInt(levelMatch[1], 10) : 0;

//       const originalDate = row.transdate;
//       const transaction_status = row.trstatus == 1 ? 'SUCCESS' : row.trstatus == 2 ? 'FAILED' : 'PENDING';
//       const transaction_for = row.crdb == 'C' ? 'CREDIT' : row.crdb == 'D' ? 'DEBIT' : null;
//       const transaction_type = row.transtype == "LevelIncome" ? 'LEVEL_INCOME' : row.transtype == "withdraw" ? 'WITHDRAW' : row.transtype == "Deduct" ? 'DEDUCT' : null;
//       const remark = row.remark;
//       const admin_comment = row.errormessage || null;
//       const regno = row.regno;
//       const amount = row.credit || row.debit || row.tramount || 0; // Fallback to tramount if credit/debit is null
//       const credit = row.credit || 0;
//       const debit = row.debit || 0;
//       const tramount = row.tramount || 0;
// // const cleanAmount = Math.floor(parseFloat(rawAmount));
//       // 2. Level-wise Amount Logic
//       // let amount = 0;
//       // const amountMap: Record<number, number> = {
//       //   1: 3500, 2: 2500, 3: 1500, 4: 1000, 5: 750,
//       //   6: 750, 7: 500, 8: 500, 9: 500, 10: 1000
//       // };
//       // amount = amountMap[levelNum] || 0;

//       // 3. Resolve IDs using Parameterized Queries (Safe from SQL Injection)
//       const { rows: users } = await pgPool.query(`
//         SELECT id, regno, username FROM up_users 
//         WHERE regno = $1 OR username = $2 OR regno = $2
//       `, [row.regno, sourceUserRegno]);

//       const earner = users.find((u: any) => u.regno == row.regno);
//       const sourceUser = users.find((u: any) => u.username == sourceUserRegno || u.regno == sourceUserRegno);

//       if (earner && sourceUser) {

//         // --- START DUPLICATE CHECK ---
//         const { rows: duplicate } = await pgPool.query(`
//           SELECT c.id FROM commissions c
//           JOIN commissions_earner_lnk el ON c.id = el.commission_id
//           JOIN commissions_source_user_lnk sl ON c.id = sl.commission_id
//           WHERE el.user_id = $1 
//             AND sl.user_id = $2 
//             AND c.level = $3 
//             AND c.earned_at = $4
//         `, [earner.id, sourceUser.id, levelNum, originalDate]);

//         if (duplicate.length > 0) {
//           console.log(`⏭️ Skipping Duplicate: Earner ${row.regno} already credited from ${sourceUserRegno}`);
//           continue;
//         }
//         // --- END DUPLICATE CHECK ---

//         // 4. Insert into Main Commissions Table
//         const res = await pgPool.query(`
//           INSERT INTO commissions (
//             transaction_type, level, amount, earned_at, published_at, created_at, updated_at, transaction_status, transaction_for, remark, admin_comment, regno, credit, debit, tramount
//           )
//           VALUES ($1, $2, $3, $4, $4, $4, $4, $5, $6, $7, $8, $9, $10, $11, $12)
//           RETURNING id
//         `, [transaction_type, levelNum, amount, originalDate, transaction_status, transaction_for, remark, admin_comment, regno, credit, debit, tramount]);

//         const commissionId = res.rows[0].id;

//         // 5. Link Tables
//         await pgPool.query(`
//           INSERT INTO commissions_earner_lnk (commission_id, user_id)
//           VALUES ($1, $2)
//         `, [commissionId, earner.id]);

//         await pgPool.query(`
//           INSERT INTO commissions_source_user_lnk (commission_id, user_id)
//           VALUES ($1, $2)
//         `, [commissionId, sourceUser.id]);

//         console.log(`✅ [ID:${row.id}] Migrated -> Comm ID:${commissionId} | Level: ${levelNum}`);
//       } else {
//         console.error(`❌ Users not found for row ${row.id}: Earner: ${!!earner}, Source: ${!!sourceUser}`);
//       }
//     } catch (err: any) {
//       console.error(`❌ Error on legacy ID ${row.id}:`, err.message);
//     }
//   }

//   console.log("🏁 Commission migration finished");
//   process.exit(0);
// }

// migrateCommissions().catch(console.error);


import { pgPool } from "./config/postgres";

async function migrateCommissions() {
  const { rows: sourceRecords } = await pgPool.query(`
    SELECT *
    FROM member_accounts 
  `);

  console.log(`Found ${sourceRecords.length} records to migrate.`);

  for (const row of sourceRecords) {
    try {
      // 1. Safe Regex Extraction: Uses optional chaining to prevent "reading properties of null"
      const childCodeMatch = row.remark ? row.remark.match(/from\s+([A-Z0-9]+)/i) : null;
      const levelMatch = row.remark ? row.remark.match(/level\s*(\d+)/i) : null;

      const sourceUserRegno = childCodeMatch?.[1] || null;
      const levelNum = levelMatch ? parseInt(levelMatch[1], 10) : 0;

      // 2. Data Mapping
      const originalDate = row.transdate || new Date();
      const transaction_status = row.trstatus == 1 ? 'SUCCESS' : row.trstatus == 2 ? 'FAILED' : 'PENDING';
      const transaction_type = row.crdb == 'C' ? 'CREDIT' : row.crdb == 'D' ? 'DEBIT' : null;
      
      const transaction_for = row.transtype === "LevelIncome" ? 'LEVEL_INCOME' : 
                               row.transtype === "withdraw" ? 'WITHDRAW' : 
                               row.transtype === "Deduct" ? 'DEDUCT' : null;

      const remark = row.remark;
      const admin_comment = row.errormessage || null;
      const regno = row.regno;

      // Ensure amount is handled as a rounded integer for bigint safety
      const rawAmount = row.credit || row.debit || row.tramount || 0;
      const amount = Math.floor(parseFloat(rawAmount)); 
      
      const credit = row.credit || 0;
      const debit = row.debit || 0;
      const tramount = row.tramount || 0;

      // 3. Resolve Earner (Required) and SourceUser (Optional)
      const { rows: users } = await pgPool.query(`
        SELECT id, regno, username FROM up_users 
        WHERE regno = $1 OR username = $2 OR regno = $2
      `, [row.regno, sourceUserRegno]);

      const earner = users.find((u: any) => u.regno == row.regno);
      const sourceUser = sourceUserRegno ? users.find((u: any) => u.username == sourceUserRegno || u.regno == sourceUserRegno) : null;

      // We only skip if the EARNER is missing. SourceUser is now optional.
      if (earner) {
        
        // --- START DUPLICATE CHECK ---
        // Using LEFT JOIN on source_user_lnk to handle cases where sourceUser is null
        const { rows: duplicate } = await pgPool.query(`
          SELECT c.id FROM commissions c
          JOIN commissions_earner_lnk el ON c.id = el.commission_id
          LEFT JOIN commissions_source_user_lnk sl ON c.id = sl.commission_id
          WHERE el.user_id = $1 
            AND (sl.user_id = $2 OR $2 IS NULL)
            AND c.level = $3 
            AND c.earned_at = $4
        `, [earner.id, sourceUser?.id || null, levelNum, originalDate]);

        if (duplicate.length > 0) {
          console.log(`⏭️ Skipping Duplicate: ID ${row.id} for Earner ${row.regno}`);
          continue;
        }
        // --- END DUPLICATE CHECK ---

        // 4. Insert into Main Commissions Table
        // Note: amount is explicitly cast to bigint to avoid "invalid input syntax"
        const res = await pgPool.query(`
          INSERT INTO commissions (
            transaction_type, level, amount, earned_at, published_at, created_at, updated_at, 
            transaction_status, transaction_for, remark, admin_comment, regno, credit, debit, tramount
          )
          VALUES ($1, $2, $3, $4, $4, $4, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id
        `, [transaction_type, levelNum, amount, originalDate, transaction_status, transaction_for, remark, admin_comment, regno, credit, debit, tramount]);

        const commissionId = res.rows[0].id;

        // 5. Link Earner (Required)
        await pgPool.query(`
          INSERT INTO commissions_earner_lnk (commission_id, user_id)
          VALUES ($1, $2)
        `, [commissionId, earner.id]);

        // 6. Link Source User (Optional - only if found)
        if (sourceUser) {
          await pgPool.query(`
            INSERT INTO commissions_source_user_lnk (commission_id, user_id)
            VALUES ($1, $2)
          `, [commissionId, sourceUser.id]);
          console.log(`✅ [ID:${row.id}] Migrated -> Comm ID:${commissionId} (With Source)`);
        } else {
          console.log(`⚠️ [ID:${row.id}] Migrated -> Comm ID:${commissionId} (No Source Found)`);
        }

      } else {
        console.error(`❌ Earner not found in up_users for row ${row.id} (Regno: ${row.regno})`);
      }
    } catch (err: any) {
      console.error(`❌ Critical Error on legacy ID ${row.id}:`, err.message);
    }
  }

  console.log("🏁 Commission migration finished");
  process.exit(0);
}

migrateCommissions().catch(console.error);