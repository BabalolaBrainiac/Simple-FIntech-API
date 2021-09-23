const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const config = require("../config/config");
const errors = require("restify-errors");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const pool = require("../controllers/db");

//Signup New User
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      throw err;
    } else {
      const user = new User({
        user_id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        account_id: "123456789",
        withdrawal_bank: "Not set",
        w_bank_account: "123456789",
        beneficiaries: "",
        transfer_secret_code: "ope",
      });
      let sql = `INSERT INTO users VALUES('${user.user_id}', '${user.username}', '${user.password}', '${user.name}', '${user.email}', '${user.account_id}', '${user.account_balance}', '${user.withdrawal_bank}', '${user.w_bank_account}', '${user.beneficiaries}','${user.transfer_secret_code}' );
      `;
      pool.execute(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
          console.log(result);
          res.status(200).json("User Saved to DB Successfully");
        }
      });
    }
  });
});

//Set Transaction/Transfer Security Code
router.post("/setpin", (req, res, next) => {
  const user = ({ email, pin } = req.body);
  bcrypt.hash(user.pin, 5, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      let sql = `UPDATE users SET transfer_secret_code = ('${hash}') WHERE (email = '${user.email}')`;
      pool.execute(sql, (err, pin) => {
        if (err) {
          throw err;
        } else {
          console.log(pin);
          res
            .status(200)
            .json("Transaction Security Code Successfully Created");
        }
      });
    }
  });
});

module.exports = router;
