const express = require("express");
const {
  initializeTransaction,
  verifyPayment,
} = require("../controllers/paystack");
const router = express.Router();
const Transaction = require("../models/transaction");
const errors = require("restify-errors");
const config = require('../config/config')
const mongoose = require("mongoose");
const pool = require("../controllers/db");

//Fund Account using Paystack
router.post("/fund", async (req, res, next) => {
  const data = {
    email: req.body.email,
    amount: req.body.amount,
    ref: new mongoose.Types.ObjectId(),
  };

  //Initialize Transaction with paystack
  const form = {
    amount: data.amount * 100,
    email: data.email,
    reference: data.ref,
  };

  let paystackResponse = await initializeTransaction(form);

  //create new transaction with form data
  const transaction_data = new Transaction({
    transaction_id: data.ref,
    amount: data.amount,
    medium: "paystack",
    userId: req.body._id,
    date: new Date(),
    status: "Transaction Pending",
    type: "Credit",
  });

  //log new transaction to DB
  let sql = `INSERT INTO transactions VALUES('${transaction_data.transaction_id}', '${transaction_data.amount}', '${transaction_data.medium}', '${transaction_data.userId}', '${transaction_data.date}', '${transaction_data.status}')`;
  await pool.execute(sql, (err, result) => {
    if (err) {
      return new errors.InternalServerError("User could not be saved to DB");
    } else {
      console.log(result);
      res.status(200).json("Transaction Saved to DB Successfully");
    }
  });

  //redirect user after transaction has been logged to DB
  if (paystackResponse)
    res.redirect(301, paystackResponse.data.authorization_url);
});

//Verify payment before funding user
router.get("/verify", async (req, res, next) => {
  const { transaction_id, user_id } = req.body;

  const response = await verifyPayment(transaction_id);
  //Update Transaction in DB after verification

  let sql = `
  UPDATE transactions SET status = '${response.data.status}', medium = '${response.data.channel}', date = '${response.data.date}'
  WHERE transaction_id = '${transaction_id}'`;
  await pool.execute(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.status(200).json("Transaction Update Successful");
    }
  });

  //Fund User Account if Transaction is Successful
  if ((response.data.status = "success")) {
    let sql = `
    UPDATE users SET account_balance = (account_balance + '${response.data.amount}') 
    WHERE user_id = '${user_id}'
    `;
    await pool.execute(sql, (err, result) => {
      if (err) {
        throw err;
      } else console.log(result);
      res
        .status(200)
        .json(
          "Your account has been funded with" + response.data.amount + "Naira"
        );
    });
  } else {
    throw err;
  }
});

//Send Money to other users using email
router.post("/send", async (req, res, next) => {
  const transactionPayload = ({ sender, receiver, amount, description } =
    req.body);

  //Select Recipient
  let sql = `SELECT name FROM users WHERE (email = '${transactionPayload.receiver}')`;
  pool.execute(sql, (err, recipient) => {
    if (err) {
      throw err;
    } else console.log(recipient);
    res.status(200).json({
      Message: `You are sending '${transactionPayload.amount}' to '${recipient}'. Click Verify to Proceed`,
    });
  });
});

//Verify User before sending
router.get("/verifysending", (req, res, next) => {
  const transactionPayload = ({
    sender,
    receiver,
    amount,
    description,
    transaction_pin,
  } = req.body);

  //Ensure Sender has Sufficient funds
  let sql = `FROM users
  SELECT IF ('${transactionPayload.amount}' >= account_balance, 'sufficient', 'insufficient')
  WHERE email = '${transactionPayload.sender}'
  `;
  pool.execute(sql, (insufficient, sufficient) => {
    if (insufficient) {
      console.log(insufficient);
      res
        .status(500)
        .json("You have Insufficient funds to perform this transaction");
    } else if (sufficient) {
      //Credit Receiver/Debit Sender
      let sql = `UPDATE users SET account_balance = (account_balance - '${amount}')
      WHERE (email = '${transactionPayload.sender}');
      UPDATE users SET account_balance = (account_balance + '${amount}')
      (where email = '${transactionPayload.receiver}')
      `;
      pool.execute(sql, (err, status) => {
        if (err) {
          throw err;
        } else console.log(status);
        res.status(200).json({
          Message: `You have successfully sent '${transactionPayload.amount}' to '${transactionPayload.receiver}'`,
        });
      });
    }
  });

  //Withdraw to Bank Account
  router.get("/withdraw", async (req, res, next) => {
    const transactionPayload = ({
      userId,
      beneficiary,
      w_bank_account,
      amount,
    } = req.body);

    //Ensure User has Sufficient funds
    let sql = `FROM users
    SELECT IF ('${transactionPayload.amount}' >= account_balance, 'sufficient', 'insufficient')
  WHERE user_id = '${transactionPayload.userId}'
   
  `;
    pool.execute(sql, (insufficient, sufficient) => {
      if (insufficient) {
        console.log(insufficient);
        res.status(500).json("You have Insufficient funds to Withdraw");
      } else if (sufficient) {
        //Credit to Beneficiary account, and debit from DB
        let sql = `UPDATE users SET account_balance = (account_balance - '${transactionPayload.amount}')
      WHERE (user_id = '${transactionPayload.use_id}');`;
        pool.execute(sql, (err, status) => {
          if (err) {
            throw err;
          } else console.log(status);
          res.status(200).json({
            Message: `You have successfully withdrawn '${transactionPayload.amount}'`,
          });
        });
      }
    });
  });
  /* 
    //Verify Transaction Secret Code
    let sql = `SELECT transaction_secret-key FROM users WHERE (email = '${transactionPayload.sender}')`;
    await pool.execute(sql, (err, hash) => {
      if (err) {
        throw err;
      } else return hash;
    });
    const verifification = await verifyPassword(
      transactionPayload.transaction_pin,
      hash
    );
    if ((verifification = "False")) {
      res.status(500).json("Incorrect Transaction Secret Code");
    } else if ((verifification = "True")) {
      fundAccount(
        transactionPayload.sender,
        transactionPayload.amount,
        transactionPayload.receiver
      );
    }
  } */
});

module.exports = router;
