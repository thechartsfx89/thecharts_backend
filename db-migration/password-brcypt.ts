import bcrypt from "bcrypt";
import { pgPool } from "./config/postgres";
// import { pgPool } from "./config/postgres.js";

const SALT_ROUNDS = 10;

async function hashPasswords() {
  const { rows } = await pgPool.query(`
    SELECT id, mssql_password
    FROM up_users
    WHERE mssql_password IS NOT NULL
  `);

  console.log(`Found ${rows.length} users to hash`);

  for (const user of rows) {
    const hashed = await bcrypt.hash(user.mssql_password, SALT_ROUNDS);

    await pgPool.query(
      `UPDATE up_users SET mssql_password = $1 WHERE id = $2`,
      [hashed, user.id]
    );
  }

  console.log("✅ Password hashing completed");
  process.exit(0);
}

hashPasswords().catch(console.error);
