import pkg from "pg";
const { Pool } = pkg;

export const pgPool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  database: "edu_20feb_final",
  user: "gauravhead_hr",
  password: "educandle_pass",
  pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000, // Increase timeout to 60 seconds
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
    },
});
