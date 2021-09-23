const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Define Sending Schema
const sendingSchema = new Schema({
  sender: {
    name: String,
    _id: Schema.Types.ObjectId,
  },
  receiver: {
    name: String,
    _id: Schema.Types.ObjectId,
  },
  description: String,
  amount: Number,
  date: Date,
});

module.exports = mongoose.model("Send", sendingSchema);
