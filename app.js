const express = require("express");
const app = express();
const errors = require("restify-errors");
const config = require("./config/config");
const morgan = require("morgan");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");

//Middlewares
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(bodyparser.json());

//Handle CORS
app.use(cors);

//Setup MySql
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: config.MySQL_Password,
  database: "simplefintech",
});

//Connect to MySQL Database
db.connect((err) => {
  if (err) {
    return new errors.InternalServerError("Could Not Connect To Database");
  }
  console.log("Server Connected Successfully");
});

module.exports = app;
