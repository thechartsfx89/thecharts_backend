// import { connectMSSQL } from "../config/mssql";
// import { pgPool } from "../config/postgres";

// /* ---------- TYPE MAPPING ---------- */
// function mapType(type: string): string {
//   const t = type.toLowerCase();
//   if (t.includes("bigint")) return "BIGINT";
//   if (t.includes("int")) return "INTEGER";
//   if (t.includes("bit")) return "BOOLEAN";
//   if (t.includes("decimal") || t.includes("numeric")) return "NUMERIC";
//   if (t.includes("money")) return "NUMERIC(19,4)";
//   if (t.includes("float")) return "DOUBLE PRECISION";
//   if (t.includes("date") && !t.includes("time")) return "DATE";
//   if (t.includes("datetime") || t.includes("timestamp")) return "TIMESTAMP";
//   if (t.includes("uniqueidentifier")) return "UUID";
//   return "TEXT";
// }

// /* ---------- RESERVED PG COLUMNS ---------- */
// const RESERVED_PG_COLUMNS = new Set([
//   "ctid",
//   "oid",
//   "xmin",
//   "xmax",
//   "tableoid",
// ]);

// function safeColumnName(name: string): string {
//   const n = name.toLowerCase();
//   return RESERVED_PG_COLUMNS.has(n) ? `mssql_${n}` : n;
// }

// /* ---------- MIGRATION ---------- */
// export async function migrateToStrapi(
//   schema: string,
//   sourceTable: string,
//   targetTable: string,
//   batchSize = 500
// ) {
//   const mssql = await connectMSSQL();

//   console.log(`🚀 Migrating ${schema}.${sourceTable} → ${targetTable}`);

//   /* 1️⃣ Read MSSQL columns */
//   const colRes = await mssql.request().query(`
//     SELECT COLUMN_NAME, DATA_TYPE
//     FROM INFORMATION_SCHEMA.COLUMNS
//     WHERE TABLE_SCHEMA='${schema}'
//       AND TABLE_NAME='${sourceTable}'
//     ORDER BY ORDINAL_POSITION
//   `);

//   const mssqlCols = colRes.recordset.map((c: any) => ({
//     original: c.COLUMN_NAME.toLowerCase(),
//     pg: safeColumnName(c.COLUMN_NAME),
//     type: mapType(c.DATA_TYPE),
//   }));

//   /* 🔑 Column map: MSSQL → PG */
//   const columnMap = new Map<string, string>();
//   for (const c of mssqlCols) {
//     columnMap.set(c.original, c.pg);
//   }

//   /* 2️⃣ Create Strapi-style base table */
//   await pgPool.query(`
//     CREATE TABLE IF NOT EXISTS ${targetTable} (
//       id BIGSERIAL PRIMARY KEY,
//       created_at TIMESTAMP DEFAULT NOW(),
//       updated_at TIMESTAMP DEFAULT NOW(),
//       published_at TIMESTAMP
//     )
//   `);

//   /* 3️⃣ Read existing PG columns */
//   const pgColsRes = await pgPool.query(`
//     SELECT column_name
//     FROM information_schema.columns
//     WHERE table_name = '${targetTable}'
//   `);
//   const pgCols = pgColsRes.rows.map(r => r.column_name);

//   /* 4️⃣ Add missing columns */
//   for (const col of mssqlCols) {
//     if (!pgCols.includes(col.pg)) {
//       await pgPool.query(
//         `ALTER TABLE ${targetTable} ADD COLUMN "${col.pg}" ${col.type}`
//       );
//       console.log(`➕ Added column: ${col.pg}`);
//     }
//   }

//   /* 5️⃣ Migrate data (FIXED INSERT) */
//   let offset = 0;

//   while (true) {
//     const res = await mssql.request().query(`
//       SELECT *
//       FROM [${schema}].[${sourceTable}]
//       ORDER BY (SELECT NULL)
//       OFFSET ${offset} ROWS
//       FETCH NEXT ${batchSize} ROWS ONLY
//     `);

//     if (!res.recordset.length) break;

//     for (const row of res.recordset) {
//       const insertCols: string[] = [];
//       const insertVals: any[] = [];

//       for (const [key, value] of Object.entries(row)) {
//         const pgCol = columnMap.get(key.toLowerCase());
//         if (!pgCol) continue;

//         insertCols.push(`"${pgCol}"`);
//         insertVals.push(value);
//       }

//       await pgPool.query(
//         `
//         INSERT INTO ${targetTable}
//         (${insertCols.join(",")}, created_at, updated_at, published_at)
//         VALUES (
//           ${insertVals.map((_, i) => `$${i + 1}`).join(",")},
//           NOW(), NOW(), NOW()
//         )
//         `,
//         insertVals
//       );
//     }

//     offset += res.recordset.length;
//     console.log(`✅ ${sourceTable}: ${offset} rows migrated`);
//   }

//   console.log(`🎉 Completed ${sourceTable}`);
// }

import { connectMSSQL } from "../config/mssql";
import { pgPool } from "../config/postgres";

/* ---------- TYPE MAPPING ---------- */
function mapType(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("bigint")) return "BIGINT";
  if (t.includes("int")) return "INTEGER";
  if (t.includes("bit")) return "BOOLEAN";
  if (t.includes("decimal") || t.includes("numeric")) return "NUMERIC";
  if (t.includes("money")) return "NUMERIC(19,4)";
  if (t.includes("float")) return "DOUBLE PRECISION";
  if (t.includes("date") && !t.includes("time")) return "DATE";
  if (t.includes("datetime") || t.includes("timestamp")) return "TIMESTAMP";
  if (t.includes("uniqueidentifier")) return "UUID";
  return "TEXT";
}

/* ---------- STRAPI / PG RESERVED COLUMNS ---------- */
const RESERVED_PG_COLUMNS = new Set([
  "ctid",
  "oid",
  "xmin",
  "xmax",
  "tableoid",

  // Strapi core
  "id",
  "created_at",
  "updated_at",
  "published_at",
  "password",
  "provider",
  "username",
  "email",
  "confirmed",
  "blocked",
  "reset_password_token",
  "confirmation_token",
]);

/* ---------- SAFE COLUMN NAME ---------- */
function safeColumnName(name: string): string {
  const n = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");

  return RESERVED_PG_COLUMNS.has(n) ? `mssql_${n}` : n;
}

/* ---------- MIGRATION ---------- */
export async function migrateToStrapi(
  schema: string,
  sourceTable: string,
  targetTable: string,
  batchSize = 500
) {
  const mssql = await connectMSSQL();

  const quotedTarget = `"${targetTable}"`;

  console.log(`🚀 Migrating ${schema}.${sourceTable} → ${targetTable}`);

  /* 1️⃣ READ MSSQL COLUMNS */
  const colRes = await mssql.request().query(`
    SELECT COLUMN_NAME, DATA_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA='${schema}'
      AND TABLE_NAME='${sourceTable}'
    ORDER BY ORDINAL_POSITION
  `);

  const mssqlCols = colRes.recordset.map((c: any) => ({
    original: c.COLUMN_NAME.toLowerCase(),
    pg: safeColumnName(c.COLUMN_NAME),
    type: mapType(c.DATA_TYPE),
  }));

  /* COLUMN MAP */
  const columnMap = new Map<string, string>();
  for (const c of mssqlCols) {
    columnMap.set(c.original, c.pg);
  }

  /* 2️⃣ ENSURE BASE STRAPI TABLE EXISTS */
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS ${quotedTarget} (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      published_at TIMESTAMP
    )
  `);

  /* 3️⃣ READ EXISTING PG COLUMNS */
  const pgColsRes = await pgPool.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1
  `, [targetTable]);

  const pgCols = pgColsRes.rows.map(r => r.column_name);
  const pgColsSet = new Set(pgCols);

  /* 4️⃣ ADD MISSING COLUMNS (BYPASS STRAPI CORE) */
  for (const col of mssqlCols) {
    if (pgColsSet.has(col.pg) || RESERVED_PG_COLUMNS.has(col.pg)) {
      console.log(`⏭️ Skipped column: ${col.pg}`);
      continue;
    }

    await pgPool.query(
      `ALTER TABLE ${quotedTarget} ADD COLUMN "${col.pg}" ${col.type}`
    );

    console.log(`➕ Added column: ${col.pg}`);
    pgColsSet.add(col.pg);
  }

  /* 5️⃣ MIGRATE DATA */
  let offset = 0;

  while (true) {
    const res = await mssql.request().query(`
      SELECT *
      FROM [${schema}].[${sourceTable}]
      ORDER BY (SELECT NULL)
      OFFSET ${offset} ROWS
      FETCH NEXT ${batchSize} ROWS ONLY
    `);

    if (!res.recordset.length) break;

    for (const row of res.recordset) {
      const insertCols: string[] = [];
      const insertVals: any[] = [];

      for (const [key, value] of Object.entries(row)) {
        const pgCol = columnMap.get(key.toLowerCase());
        if (!pgCol) continue;
        if (!pgColsSet.has(pgCol)) continue;
        if (RESERVED_PG_COLUMNS.has(pgCol)) continue;

        insertCols.push(`"${pgCol}"`);
        insertVals.push(value);
      }

      if (!insertCols.length) continue;

      const placeholders = insertVals.map((_, i) => `$${i + 1}`).join(",");

      await pgPool.query(
        `
        INSERT INTO ${quotedTarget}
        (${insertCols.join(",")}, created_at, updated_at, published_at)
        VALUES (${placeholders}, NOW(), NOW(), NOW())
        `,
        insertVals
      );
    }

    offset += res.recordset.length;
    console.log(`✅ ${sourceTable}: ${offset} rows migrated`);
  }

  console.log(`🎉 Completed ${sourceTable}`);
}


// import { connectMSSQL } from "../config/mssql";
// import { pgPool } from "../config/postgres";

// /* ---------- TYPE MAPPING ---------- */
// function mapType(type: string): string {
//   const t = type.toLowerCase();
//   if (t.includes("bigint")) return "BIGINT";
//   if (t.includes("int")) return "INTEGER";
//   if (t.includes("bit")) return "BOOLEAN";
//   if (t.includes("decimal") || t.includes("numeric")) return "NUMERIC";
//   if (t.includes("money")) return "NUMERIC(19,4)";
//   if (t.includes("float")) return "DOUBLE PRECISION";
//   if (t.includes("date") && !t.includes("time")) return "DATE";
//   if (t.includes("datetime") || t.includes("timestamp")) return "TIMESTAMP";
//   if (t.includes("uniqueidentifier")) return "UUID";
//   return "TEXT";
// }

// /* ---------- STRAPI / PG RESERVED COLUMNS ---------- */
// const RESERVED_PG_COLUMNS = new Set([
//   "ctid", "oid", "xmin", "xmax", "tableoid",
//   "id", "created_at", "updated_at", "published_at",
//   "password", "provider", "username", "email",
//   "confirmed", "blocked", "reset_password_token", "confirmation_token",
// ]);

// /* ---------- SAFE COLUMN NAME ---------- */
// function safeColumnName(name: string): string {
//   const n = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
//   return RESERVED_PG_COLUMNS.has(n) ? `mssql_${n}` : n;
// }

// export async function migrateToStrapi(
//   schema: string,
//   sourceTable: string,
//   targetTable: string,
//   batchSize = 500
// ) {
//   const mssql = await connectMSSQL();
//   const quotedTarget = `"${targetTable}"`;

//   console.log(`🚀 Migrating ${schema}.${sourceTable} → ${targetTable}`);

//   /* 1️⃣ READ MSSQL COLUMNS */
//   const colRes = await mssql.request().query(`
//     SELECT COLUMN_NAME, DATA_TYPE
//     FROM INFORMATION_SCHEMA.COLUMNS
//     WHERE TABLE_SCHEMA='${schema}' AND TABLE_NAME='${sourceTable}'
//     ORDER BY ORDINAL_POSITION
//   `);

//   const mssqlCols = colRes.recordset.map((c: any) => ({
//     original: c.COLUMN_NAME.toLowerCase(),
//     pg: safeColumnName(c.COLUMN_NAME),
//     type: mapType(c.DATA_TYPE),
//   }));

//   const columnMap = new Map<string, string>();
//   const columnTypes = new Map<string, string>(); // Track types for sanitization
  
//   for (const c of mssqlCols) {
//     columnMap.set(c.original, c.pg);
//     columnTypes.set(c.pg, c.type);
//   }

//   /* 2️⃣ ENSURE TABLE & mssql_id EXISTS (Omitted for brevity, keep your existing Step 2 & 3) */
//   // ... (Your existing code to CREATE TABLE and ADD COLUMNS) ...

//   /* 3️⃣ DATA MIGRATION WITH SANITIZATION */
//   let offset = 0;
//   while (true) {
//     const res = await mssql.request().query(`
//       SELECT * FROM [${schema}].[${sourceTable}]
//       ORDER BY id ASC 
//       OFFSET ${offset} ROWS FETCH NEXT ${batchSize} ROWS ONLY
//     `);

//     if (!res.recordset.length) break;

//     for (const row of res.recordset) {
//       const insertCols: string[] = [];
//       const insertVals: any[] = [];

//       // Manually handle the tracking ID
//       insertCols.push('"mssql_id"');
//       insertVals.push(row.id || row.ID);

//      for (const [key, value] of Object.entries(row)) {
//   const lowerKey = key.toLowerCase();
//   const pgCol = columnMap.get(lowerKey);

//   if (!pgCol || lowerKey === 'id' || RESERVED_PG_COLUMNS.has(pgCol)) continue;

//   insertCols.push(`"${pgCol}"`);

//   // ✅ GLOBAL SANITIZATION
//   let sanitizedValue = value;
//   const targetType = columnTypes.get(pgCol) || "";

//   // If value is an empty string, we convert to null for non-text types
//   if (sanitizedValue === "") {
//     // List of types that absolutely cannot accept ""
//     const strictTypes = ["DATE", "TIMESTAMP", "INTEGER", "BIGINT", "NUMERIC", "BOOLEAN", "DOUBLE PRECISION", "UUID"];
    
//     if (strictTypes.some(type => targetType.includes(type))) {
//       sanitizedValue = null;
//     } else {
//       // Optional: Treat ALL empty strings as NULL to be safe
//       sanitizedValue = null; 
//     }
//   }

//   // Double Check: MSSQL sometimes returns 'NULL' as a string or a very old date 
//   // like 1900-01-01 which can also cause issues.
//   if (sanitizedValue === "1900-01-01 00:00:00.000") {
//     sanitizedValue = null;
//   }

//   insertVals.push(sanitizedValue);
// }
//       const placeholders = insertVals.map((_, i) => `$${i + 1}`).join(",");

//       const query = `
//         INSERT INTO ${quotedTarget} (${insertCols.join(",")}, created_at, updated_at, published_at)
//         VALUES (${placeholders}, NOW(), NOW(), NOW())
//         ON CONFLICT ("mssql_id") DO NOTHING
//       `;

//       try {
//         await pgPool.query(query, insertVals);
//       } catch (err: any) {
//         console.error(`❌ Error at MSSQL ID ${row.id || row.ID}:`, err.message);
//         // Log the specific problematic value if needed
//         throw err;
//       }
//     }

//     offset += res.recordset.length;
//     console.log(`✅ ${sourceTable}: ${offset} rows processed`);
//   }
// }
