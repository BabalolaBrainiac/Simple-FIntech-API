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
      let sql = `INSERT INTO users VALUES('${user.user_id}', '${user.name}', '${user.password}', '${user.name}', '${user.email}', '${user.accountn_id}', '${user.account_balance}', '${user.withdrawal_bank}', '${user.w_bank_account}', '${user.beneficiaries}');
      `;
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
