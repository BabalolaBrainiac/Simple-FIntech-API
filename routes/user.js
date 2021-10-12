const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const pool = require("../controllers/db");
const jwt = require("jsonwebtoken");

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
        account_id: nanoid(10),
        withdrawal_bank: "Not set",
        w_bank_account: "Not Set",
        beneficiaries: "No Beneficiaries Added",
        transfer_secret_code: req.body.transfer_secret_code,
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

router.get("/login", (req, res, next) => {
  let sql = `SELECT email FROM users WHERE (email = '${req.body.email}')`;
  pool.execute(sql, (err, userEmail) => {
    if (err) {
      res.status(400).json("Email does not exist!");
    } else {
      let sql = `SELECT password FROM users WHERE (email = '${userEmail}')`;
      pool.execute(sql, (err, userPassword) => {
        if (err) {
          throw err;
        } else {
          bcrypt.compare(req.body.password, userPassword, (err, password) => {
            if (err) {
              res.status(500).json("Internal Server Error");
            } else {
              if ((password = "False")) {
                res.status(401).json("Incorrect User Password");
              } else if ((password = "True")) {
                const token = jwt.sign(
                  {
                    email: userEmail,
                    password: userPassword,
                  },
                  process.env.JWT_Key,
                  {
                    expiresIn: "1hr",
                  }
                );
              }
              res.status(200).json({
                Message: "User Authentication Successful",
                token: token,
              });
            }
          });
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
