
import mssql from 'mssql'
import path from 'path'
import dotenv from 'dotenv'
import { log } from 'console'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


export const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
async function run() {
    let pool = await mssql.connect(sqlConfig);
    let results = (await pool.request().query("SELECT * FROM ProdTable")).recordsets;
    log(results);
}

run();
