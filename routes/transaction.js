const express = require("express");
const router = express.Router();
import { initializeTransaction, verifyPayment } from "../controllers/paystack";
import transaction from "../models/transaction";
const Transaction = require("../models/transaction");
const User = require("../models/user");
const Send = require("../models/send");
const errors = require("restify-errors");
const mongoose = require("mongoose");
const db = require("../controllers/db");

//Fund Account using Paystack
router.post("/fund", async (req, res, next) => {
  const form = {
    email: req.body.email,
    amount: req.body.amount,
    ref: new mongoose.Types.ObjectId(),
  };

  //create a minimum fundable amount
  if (parseInt(form.amount) < 200) {
    throw new errors.InternalServerError("Minimum amount you can fund is N200");
  }

  //initiate paystack transaction
  const payData = {
    amount: form.amount,
    email: form.email,
    ref: form.ref,
  };

  let paystackResponse = await initializeTransaction(payData);

  //create and log transaction to DB
  const transaction_data = new Transaction({
    userId: req.body._id,
    value: form.amount,
    medium: "paystack",
    status: "Transaction Pending",
    date: new Date(),
  });

  //log new transaction to database
  let sql = `INSERT INTO transactions VALUES('${transaction_data.userId}', '${transaction_data.value}', '${transaction_data.medium}', '${transaction_data.status}', '${transaction_data.date}')`;
  await db.execute(sql, (err, result) => {
    if (err) {
      throw new errors.InternalServerError("User could not be saved to DB");
    }
    return result;
  });

  //redirect user after transaction
  if (paystackResponse)
    res.redirect(301, paystackResponse.data.authorization_url);
});

module.exports = router;
