// import { connectMSSQL } from "../config/mssql.js";
// import { pgPool } from "../config/postgres.js";

import { connectMSSQL } from "../config/mssql";
import { pgPool } from "../config/postgres";

function mapType(mssqlType: string): string {
  const t = mssqlType.toLowerCase();

  if (t.includes("bigint")) return "BIGINT";
  if (t.includes("int")) return "INTEGER";
  if (t.includes("bit")) return "BOOLEAN";
  if (t.includes("decimal") || t.includes("numeric")) return "NUMERIC";
  if (t.includes("money")) return "NUMERIC(19,4)";
  if (t.includes("float")) return "DOUBLE PRECISION";
  if (t.includes("date") && !t.includes("time")) return "DATE";
  if (t.includes("datetime") || t.includes("timestamp")) return "TIMESTAMP";
  if (t.includes("uniqueidentifier")) return "UUID";

  return "TEXT"; // safe fallback
}

export async function migrateTable(
  schema: string,
  sourceTable: string,
  targetTable: string,
  primaryKey: string,
  batchSize = 500
) {
  const mssql = await connectMSSQL();
  const source = `[${schema}].[${sourceTable}]`;

  console.log(`🚀 Migrating ${source} → ${targetTable}`);

  /* 1️⃣ READ COLUMN METADATA */
  const columnsResult = await mssql.request().query(`
    SELECT COLUMN_NAME, DATA_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA='${schema}'
      AND TABLE_NAME='${sourceTable}'
    ORDER BY ORDINAL_POSITION
  `);

  if (!columnsResult.recordset.length) {
    throw new Error(`❌ No columns found for ${sourceTable}`);
  }

  const columns = columnsResult.recordset.map(col => ({
    name: col.COLUMN_NAME.toLowerCase(),
    type: mapType(col.DATA_TYPE),
  }));

  /* 2️⃣ CREATE TABLE IF NOT EXISTS */
  /* 2️⃣ CREATE TABLE IF NOT EXISTS (SAFE FOR NULL DATA) */
const createSQL = `
  CREATE TABLE IF NOT EXISTS ${targetTable} (
    id BIGSERIAL PRIMARY KEY,
    ${columns.map((c:any) => `"${c.name}" ${c.type}`).join(",")}
  )
`;

await pgPool.query(createSQL);
console.log(`🧱 Table ensured: ${targetTable}`);

  await pgPool.query(createSQL);
  console.log(`🧱 Table ensured: ${targetTable}`);

  /* 3️⃣ MIGRATE DATA */
  let offset = 0;
  let total = 0;

  while (true) {
    const result = await mssql.request().query(`
      SELECT *
      FROM ${source}
      ORDER BY ${primaryKey}
      OFFSET ${offset} ROWS
      FETCH NEXT ${batchSize} ROWS ONLY
    `);

    if (!result.recordset.length) break;

    for (const row of result.recordset) {
      const cols = Object.keys(row).map(c => `"${c.toLowerCase()}"`);
      const vals = Object.values(row);
      const params = vals.map((_, i) => `$${i + 1}`).join(",");

      const insertSQL = `
        INSERT INTO ${targetTable} (${cols.join(",")})
        VALUES (${params})
      `;

      await pgPool.query(insertSQL, vals);
    }

    offset += batchSize;
    total += result.recordset.length;
    console.log(`✅ ${sourceTable}: ${total} rows`);
  }

  console.log(`🎉 Completed ${sourceTable}`);
  
}
