const mysql = require("mysql2");

//Setup MySql
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: "3306",
  password: process.env.MySQL_Password,
  database: "simple_fintech",
});

module.exports = pool.Promise();
