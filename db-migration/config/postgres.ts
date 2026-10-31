import pkg from "pg";
const { Pool } = pkg;

// export const pgPool = new Pool({
//   host: "127.0.0.1",
//   port: 5432,
//   database: "educandle_db",
//   user: "gauravhead_hr",
//   password: "educandle_pass",
//   pool: {
//       min: 2,
//       max: 10,
//       acquireTimeoutMillis: 60000, // Increase timeout to 60 seconds
//       createTimeoutMillis: 30000,
//       idleTimeoutMillis: 30000,
//       reapIntervalMillis: 1000,
//       createRetryIntervalMillis: 200,
//     },
// });

export const pgPool = new Pool({
  host: "72.62.194.30",
  port: 5432,
  database: "educandle_live",
  user: "educandle",
  password: "educandle@psql",
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

// DATABASE_CLIENT=postgres

// DATABASE_HOST=72.62.194.30

// DATABASE_PORT=5432

// DATABASE_NAME=educandle_live

// DATABASE_USERNAME=educandle

// DATABASE_PASSWORD=educandle@psql

// DATABASE_SSL=false
// DATABASE_FILENAME=
// JWT_SECRET=p9GjwKLin7kAVESBqLM1hA==