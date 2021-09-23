const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Define Transaction Schema
const transactionSchema = new Schema({
  transaction_id: mongoose.ObjectId,
  amount: Number,
  medium: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: "Not defined",
  },
  status: {
    type: String,
    enum: [
      "Transaction Successful",
      "Transaction Pending",
      "Transaction Error",
    ],
    default: "Transaction Pending",
  },
  type: String,
  date: { type: Date },
});

module.exports = mongoose.model("Transaction", transactionSchema);
