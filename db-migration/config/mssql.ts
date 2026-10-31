import sql from "mssql";

// const pool = new sql.ConnectionPool({
//   user: "Mayzonemart",
//   password: "educandle#1811212#",
//   server: "72.62.194.30",
//   database: "Live_Educandle",
//   port: 1433,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
// });
const pool = new sql.ConnectionPool({
  user: "EducandleL",
  password: "b4Y87$kWsI",
  server: "198.38.87.237",
  database: "Live_Educandle",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
// console.log("MSSQL_HOST =", process.env.MSSQL_HOST);

let poolConnected = false;

export async function connectMSSQL(): Promise<sql.ConnectionPool> {
  if (!poolConnected) {
    await pool.connect();
    poolConnected = true;
  }
  return pool;
}
