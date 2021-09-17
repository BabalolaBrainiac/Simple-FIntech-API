const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const config = require("../config/config");
const errors = require("restify-errors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

//Setup MySql
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: "3306",
  password: config.MySQL_Password,
  database: "simple_fintech",
});

//Signup New User
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return new errors.InternalServerError("Password Error");
    } else {
      const user = new User({
        user_id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hash,
        account_id: nanoid(),
        withdrawal_bank: "Not set",
      });
      let sql = `INSERT INTO users VALUES('${user.user_id}', '${user.name}', '${user.password}', '${user.name}', '${user.email}', '${user.accountn_id}', '${user.account_balance}', '${user.withdrawal_bank}', '${user.w_bank_account}', '${user.beneficiaries}')`;
      pool.execute(sql, (err, result) => {
        if ((err, result)) {
          if (err) {
            res.status(201).json({
              Error: err,
              Error_Msg: "Signup Not Successful",
            });
          }
        }
        console.log(result);
        res.status(200).json("User Saved to DB Successfully");
      });
    }
  });
});

//Fetch Users From Database
router.get("/getusers", (req, res, next) => {
  User.find();
  let sql = "SELECT * from users";
  pool.execute(sql, (err, users) => {
    if (err) {
      res.status(500).json("Unable to retrieve Users");
    } else {
      console.log(users);
      res.status(200).json("Users Successfully Retrieved");
    }
  });
});

//Fetch Specific User
router.post("/:user_id", (req, res, next) => {
  let id = req.params.user_id;
  const sql = `SELECT * FROM users WHERE user_id = ${id}`;
  pool.execute(sql, (err, user) => {
    if (err) {
      return new errors.ResourceNotFoundError("User Not Found");
    } else {
      console.log(user);
      res.status(200).json("User Successfully Retrieved");
    }
  });
});

module.exports = router;
