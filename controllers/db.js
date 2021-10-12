const mysql = require("mysql2");
const config = require("../config/config");

//Setup MySql
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: "3306",
  password: process.env.MySQL_Password,
  database: "simple_fintech",
});

module.exports = pool;
