import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Define Transaction Schema
const accountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  account_id: {
    type: Number,
    ref: "Users",
  },
  Beneficiaries: [],
  Withdrawal_Bank: {
    bank_name: String,
    account_number: Number,
  },
  date_created: { type: Date },
});

export default mongoose.model("Account", accountSchema);
