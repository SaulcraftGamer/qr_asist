// db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",      // o la IP de tu servidor PostgreSQL
  user: "postgres",
  password: "2711",
  database: "qr_asist",
  port: 5432              // puerto por defecto de PostgreSQL
});

module.exports = pool;