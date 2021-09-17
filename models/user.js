const mongoose = require("mongoose");

//User Schema Defined
const userSchema = mongoose.Schema({
  user_id: { type: mongoose.ObjectId },
  username: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  account_id: String,
  account_balance: {
    type: Number,
    default: "0",
  },
  withdrawal_bank: String,
  w_bank_account: { type: Number, default: 0000000000 },
  beneficiaries: { type: String, default: "No Beneficiaries Yet" },
  });
module.exports = mongoose.model("User", userSchema)
