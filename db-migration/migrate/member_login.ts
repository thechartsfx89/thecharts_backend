// import { mssqlPool } from "../config/mssql.js";
// import { pgPool } from "../config/postgres.js";

// export async function migrateMemberLogin() {
//   const batchSize = 500;
//   let offset = 0;

//   while (true) {
//     const pool = await mssqlPool;
//     const result = await pool.request().query(`
//       SELECT *
//       FROM Member_login
//       ORDER BY MemberID
//       OFFSET ${offset} ROWS
//       FETCH NEXT ${batchSize} ROWS ONLY
//     `);

//     if (!result.recordset.length) break;

//     for (const row of result.recordset) {
//       await pgPool.query(
//         `
//         INSERT INTO member_logins
//         (id, username, password, email, mobile, created_at)
//         VALUES ($1,$2,$3,$4,$5,$6)
//         ON CONFLICT (id) DO NOTHING
//         `,
//         [
//           row.MemberID,
//           row.UserName,
//           row.Password,
//           row.Email,
//           row.Mobile,
//           row.CreatedDate,
//         ]
//       );
//     }

//     offset += batchSize;
//     console.log(`✅ Migrated ${offset} member_login rows`);
//   }
// }
