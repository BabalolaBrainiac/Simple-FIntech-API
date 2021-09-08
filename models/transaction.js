import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Define Transaction Schema
const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  value: Number,
  medium: String,
  reference: String,
  status: {
    type: String,
    enum: [
      "Transaction Successful",
      "Transaction Pending",
      "Transaction Error",
    ],
    default: "Transaction Pending",
  },
  date: { type: Date },
});

export default mongoose.model("Transactions", transactionSchema);
