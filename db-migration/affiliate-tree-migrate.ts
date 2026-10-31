import { pgPool } from "./config/postgres";

async function migrateAffiliateTree() {
  const { rows: commissions } = await pgPool.query(`
    SELECT id, regno, remark, transdate 
    FROM member_accounts
  `);

  console.log(`Found ${commissions.length} records to migrate.`);

  for (const row of commissions) {
    try {
      const childCodeMatch = row.remark.match(/from\s+([A-Z0-9]+)/i);
      const levelMatch = row.remark.match(/level\s*(\d+)/i);

      if (!childCodeMatch || !levelMatch) continue;

      const childRegno = childCodeMatch[1]; // The username/code from remark
      const levelNum = parseInt(levelMatch[1], 10);

      // 1. Find BOTH internal IDs by checking regno and username
      const { rows: users } = await pgPool.query(`
        SELECT id, regno, username FROM up_users 
        WHERE regno = '${row.regno}' OR username = '${childRegno}' OR regno = '${childRegno}'
      `);
     
      const parentUser = users.find((u: any) => u.regno == row.regno);
      // Find child by checking both username and regno to be safe
      const childUser = users.find((u: any) => u.username == childRegno || u.regno == childRegno);

      if (parentUser && childUser) {
        // 2. Duplicate Check using numeric IDs
        const { rows: existing } = await pgPool.query(`
          SELECT t.id FROM affiliate_trees t
          JOIN affiliate_trees_parent_user_lnk pl ON t.id = pl.affiliate_tree_id
          JOIN affiliate_trees_child_user_lnk cl ON t.id = cl.affiliate_tree_id
          WHERE pl.user_id = $1 AND cl.user_id = $2 AND t.level = $3
        `, [parentUser.id, childUser.id, levelNum]);

        if (existing.length > 0) {
          console.log(`⏭️ Skipping duplicate: ${row.regno} -> ${childRegno}`);
          continue;
        }

        // 3. Insert into Main Table
        const res = await pgPool.query(`
          INSERT INTO affiliate_trees (level, published_at, created_at, updated_at)
          VALUES ($1, $2, $2, $2)
          RETURNING id
        `, [levelNum, row.transdate]);

        const treeId = res.rows[0].id;

        // 4. Insert numeric IDs into confirmed Link Tables (_lnk)
        await pgPool.query(`
          INSERT INTO affiliate_trees_parent_user_lnk (affiliate_tree_id, user_id)
          VALUES ($1, $2)
        `, [treeId, parentUser.id]);

        await pgPool.query(`
          INSERT INTO affiliate_trees_child_user_lnk (affiliate_tree_id, user_id)
          VALUES ($1, $2)
        `, [treeId, childUser.id]);

        console.log(`✅ Migrated: Parent ${row.regno} -> Child ${childRegno} (Level ${levelNum})`);
      } else {
        console.warn(`⚠️ User IDs not found for record ${row.id}: Parent Found: ${!!parentUser}, Child Found: ${!!childUser}`);
      }
    } catch (err: any) {
      console.error(`❌ Error migrating row ${row.id}:`, err.message);
    }
  }

  console.log("🏁 Migration task finished");
  process.exit(0);
}

migrateAffiliateTree().catch(console.error);