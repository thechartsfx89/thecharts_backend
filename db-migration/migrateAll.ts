// // import { connectMSSQL } from "../config/mssql";
// // import { pgPool } from "../config/postgres";

import { connectMSSQL } from "./config/new/mssql";
import { pgPool } from "./config/new/postgres";

// import { connectMSSQL } from "./config/new/mssql";
// import { pgPool } from "./config/new/postgres";

// /* ---------- TYPE MAPPING ---------- */
// function mapType(type: string): string {
//   const t = type.toLowerCase();
//   if (t.includes("bigint")) return "BIGINT";
//   if (t.includes("int")) return "INTEGER";
//   if (t.includes("bit")) return "BOOLEAN";
//   if (t.includes("decimal") || t.includes("numeric")) return "NUMERIC";
//   if (t.includes("datetime") || t.includes("timestamp")) return "TIMESTAMP";
//   return "TEXT";
// }

// async function migrateEverything() {
//   const mssql = await connectMSSQL();
//   console.log("🚀 Starting Fix for Composite Primary Keys...");

//   try {
//     const tablesRes = await mssql.request().query(`
//       SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
//       WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG = 'Live_Educandle'
//     `);
//     const tables = tablesRes.recordset.map((t: any) => t.TABLE_NAME);

//     for (const tableName of tables) {
//       const pgTableName = tableName.toLowerCase();

//       // 1. Get Columns
//       const colRes = await mssql.request().query(`
//         SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
//         FROM INFORMATION_SCHEMA.COLUMNS 
//         WHERE TABLE_NAME = '${tableName}'
//       `);

//       // 2. Get Primary Keys for this table
//       const pkRes = await mssql.request().query(`
//         SELECT COLUMN_NAME
//         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
//         WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1
//         AND TABLE_NAME = '${tableName}'
//       `);
//       const primaryKeys = pkRes.recordset.map((pk: any) => `"${pk.COLUMN_NAME.toLowerCase()}"`);

//       // 3. Build Table Schema
//       const colDefs = colRes.recordset.map((c: any) => {
//         const type = mapType(c.DATA_TYPE);
//         const nullability = c.IS_NULLABLE === 'YES' ? '' : 'NOT NULL';
//         return `"${c.COLUMN_NAME.toLowerCase()}" ${type} ${nullability}`;
//       });

//       // Add Primary Key constraint at the end if keys exist
//       if (primaryKeys.length > 0) {
//         colDefs.push(`PRIMARY KEY (${primaryKeys.join(", ")})`);
//       }

//       await pgPool.query(`DROP TABLE IF EXISTS "${pgTableName}" CASCADE`); // Clean start
//       await pgPool.query(`CREATE TABLE "${pgTableName}" (${colDefs.join(", ")})`);
//       console.log(`✅ Table "${pgTableName}" created with ${primaryKeys.length} Primary Key(s).`);

//       // 4. Data Transfer (Same batch logic as before)
//       const dataRes = await mssql.request().query(`SELECT * FROM [dbo].[${tableName}]`);
//       for (const row of dataRes.recordset) {
//         const keys = Object.keys(row).map(k => `"${k.toLowerCase()}"`);
//         const values = Object.values(row);
//         const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

//         await pgPool.query(`
//           INSERT INTO "${pgTableName}" (${keys.join(", ")}) 
//           VALUES (${placeholders}) 
//           ON CONFLICT DO NOTHING
//         `, values);
//       }
//     }
//   } catch (err) {
//     console.error("🚨 Migration Failed:", err);
//   } finally {
//     await pgPool.end();
//   }
// }

// migrateEverything();


// import { connectMSSQL } from "../config/mssql";
// import { pgPool } from "../config/postgres";

// import { connectMSSQL } from "../config/mssql";
// import { pgPool } from "../config/postgres";

/* ---------- IMPROVED TYPE MAPPING ---------- */
// import { connectMSSQL } from "../config/mssql";
// import { pgPool } from "../config/postgres";

/* ---------- TYPE MAPPING & SYSTEM BYPASS ---------- */
function mapType(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("bigint")) return "BIGINT";
  if (t.includes("int")) return "INTEGER";
  if (t.includes("bit")) return "BOOLEAN";
  if (t.includes("decimal") || t.includes("numeric")) return "NUMERIC";
  if (t.includes("datetime") || t.includes("timestamp")) return "TIMESTAMP";
  return "TEXT";
}

function safeColumnName(name: string): string {
  const forbidden = ["ctid", "oid", "tableoid", "xmin", "cmin", "xmax", "cmax"];
  const lowerName = name.toLowerCase();
  return forbidden.includes(lowerName) ? `mssql_${lowerName}` : lowerName;
}

async function migrateEverything() {
  const mssql = await connectMSSQL();
  console.log("🚀 Resuming migration: Bypassing missing/invalid tables...");

  try {
    const tablesRes = await mssql.request().query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG = 'Live_Educandle'
    `);
    const tables = tablesRes.recordset.map((t: any) => t.TABLE_NAME);

    for (const tableName of tables) {
      const pgTableName = tableName.toLowerCase();
      
      try {
        console.log(`📦 Table: ${tableName}`);

        // 1. Clean start
        await pgPool.query(`DROP TABLE IF EXISTS "${pgTableName}" CASCADE`);

        // 2. Fetch Columns
        const colRes = await mssql.request().query(`
          SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = '${tableName}'
        `);

        // 3. Fetch Primary Keys
        const pkRes = await mssql.request().query(`
          SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE TABLE_NAME = '${tableName}'
        `);
        const pks = pkRes.recordset.map((pk: any) => `"${safeColumnName(pk.COLUMN_NAME)}"`);

        // 4. Build Schema (Handles "id specified more than once" fix)
        const colDefs: string[] = [];
        const seenColumns = new Set<string>();

        colRes.recordset.forEach((c: any) => {
          const colName = safeColumnName(c.COLUMN_NAME);
          if (!seenColumns.has(colName)) {
            const type = mapType(c.DATA_TYPE);
            colDefs.push(`"${colName}" ${type}`);
            seenColumns.add(colName);
          }
        });

        if (pks.length > 0) colDefs.push(`PRIMARY KEY (${pks.join(", ")})`);

        await pgPool.query(`CREATE TABLE "${pgTableName}" (${colDefs.join(", ")})`);

        // 5. Data Transfer with localized Error Handling
        const dataRes = await mssql.request().query(`SELECT * FROM [dbo].[${tableName}]`);
        const rows = dataRes.recordset;

        for (const row of rows) {
          const keys = Object.keys(row).map(k => `"${safeColumnName(k)}"`);
          const values = Object.values(row);
          const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

          await pgPool.query(
            `INSERT INTO "${pgTableName}" (${keys.join(", ")}) VALUES (${placeholders})`,
            values
          );
        }
        console.log(`✅ Table "${pgTableName}" complete: ${rows.length} rows.`);

      } catch (tableErr: any) {
        // If 'tblWrongIncome' or any table fails, log it and continue to the next
        console.error(`⚠️ Skipping Table "${tableName}" due to error: ${tableErr.message}`);
      }
    }
  } catch (err: any) {
    console.error("🚨 Global Migration Failed:", err.message);
  } finally {
    await pgPool.end();
    console.log("🏁 Migration run finished.");
  }
}

migrateEverything();