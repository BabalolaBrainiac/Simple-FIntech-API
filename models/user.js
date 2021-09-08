const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const errors = require("restify-errors");

//User Schema Defined
const userSchema = mongoose.Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
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
  acc_balance: {
    type: Number,
    default: 0,
  },
  withdrawal_bank: String,
  account_number: {
    type: Number,
  },
  beneficiaries: {
    type: [],
  },
  timestamps: true,
});

//Hashing of User Password before Saving to DB

userSchema.pre("save", function (next) {
  let user = this;
  let SALT_FACTOR = 12;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err)
        return next(
          new errors.InternalServerError("Password Could Not be Saved")
        );
      user.password = hash;
      next();
    });
  });
});

//Compare Passwprd Input with User Password
userSchema.methods.comparePassword = function (userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
