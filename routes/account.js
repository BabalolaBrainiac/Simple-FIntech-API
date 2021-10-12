const express = require("express");
const router = express.Router();
const errors = require("restify-errors");
const mongoose = require("mongoose");
const pool = require("../controllers/db");
const bcrypt = require("bcrypt");
const user = require("../models/user");

//Fetch User/Account Information
router.get("/:user_id", (req, res, next) => {
  let id = req.body.user_id;
  const sql = `SELECT * FROM users WHERE user_id = '${id}'`;
  pool.execute(sql, (err, user) => {
    if (err) {
      throw err;
    } else {
      console.log(user);
      res.status(200).json({
        Message: "User Successfully Retreieved",
        User: user,
      });
    }
  });
});

//Update Withdrawal Bank
router.post("/update", (req, res, next) => {
  let { user_id, withdrawalBank, w_bank_account, userPassword } = req.body;
  /* //Verify user Password before update
  let sql = `SELECT password FROM users WHERE user_id = '${user_id}'`;
  pool.execute(sql, (err, hash) => {
    if (err) {
      throw err;
    } else {
      bcrypt.compare(userPassword, hash, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result); */
  //Update Withdrawal Bank
  const sql = `UPDATE users set withdrawal_bank = '${withdrawalBank}', w_bank_account = '${w_bank_account}'
            WHERE user_id = '${user_id}'`;
  pool.execute(sql, (err, status) => {
    if (err) {
      throw err;
    } else {
      console.log(status);
      res.status(200).json("Withdrawal Bank Successfully Updated");
    }
  });
});

//Add Benficiaries to Account
router.post("/addbeneficiary", async (req, res, next) => {
  const { bankName, accountName, accountNumber, userId } = req.body;
  //Verify user Password before adding beneficiary
  /* let sql = `SELECT password FROM users WHERE user_id = '${userId}'`;
  pool.execute(sql, (err, hash) => {
    if (err) {
      throw err;
    } else {
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result); */
  //Add Beneficiary
  const sql = `INSERT INTO beneficiaries VALUES('${userId}', '${bankName}', '${accountName}', '${accountNumber}')`;
  pool.execute(sql, (err, status) => {
    if (err) {
      throw err;
    } else {
      console.log(status);
      res.status(200).json("Withdrawal Bank Successfully Updated");
    }
  });
});

//Get List of All User Beneficiaries
router.get("/beneficiaries", (req, res, next) => {
  const { userId } = req.body;

  let sql = `SELECT * FROM beneficiaries WHERE user_id = '${userId}'`;
  pool.execute(sql, (err, list) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        Message: `Your Beneficaries are '${list}'`,
      });
    }
  });
  next();
});

//Delete Beneficiary from Beneficiary List
router.delete("/remove", (err, res, next) => {
  const { userId, accountName } = req.body;
  let sql = `REMOVE FROM beneficiaries where (user_id = '${userId}') AND account_name ='${accountName}'`;
  pool.execute(sql, (err, list) => {
    if (err) {
      throw err;
    } else {
      console.log(list);
      res.status(200).json("Beneficiary Successfully Deleted");
    }
  });
});

module.exports = router;
