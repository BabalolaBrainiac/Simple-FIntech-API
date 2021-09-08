import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Define Sending Schema
const sendingSchema = new Schema({
  sender: {
    name: String,
    _id: Schema.Types.ObjectId,
    ref: "Users",
  },
  receiver: {
    name: String,
    _id: Schema.Types.ObjectId,
    ref: "Users",
  },
  description: String,
  amount: Number,
  date: Date,
});

export default mongoose.model("Send", sendingSchema);
