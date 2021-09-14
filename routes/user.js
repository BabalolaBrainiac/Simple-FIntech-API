const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const config = require("../config/config");
const errors = require("restify-errors");
const mysql = require("mysql");
const { nanoid } = require("nanoid");

//Setup MySql
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  password: config.MySQL_Password,
  database: "simple_fintech",
});

//Connect to MySQL Database
db.connect((err) => {
  if (err) {
    return new errors.InternalServerError("Could Not Connect To Database");
  }
  console.log("Server Connected Successfully");
});

//Signup New User
router.post("/signup", (req, res, next) => {
  const user = new User({
    user_id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    account_id: nanoid(10),
    withdrawal_bank: "Not set",
    w_bank_account: "",
    beneficiaries: "None",
  });
  let sql = "INSERT INTO users set ?";
  let query = db.query(sql, user, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.status(200).json("User Saved to DB Successfully");
  });
});

module.exports = router;
