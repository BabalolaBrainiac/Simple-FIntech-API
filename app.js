const express = require("express");
const app = express();
require("dotenv").config();
const errors = require("restify-errors");
const morgan = require("morgan");
const cors = require("cors");
const expressSession = require("express-session")({
  secret: process.env.expressSecret,
  saveUninitialized: false,
  resave: false,
});
const passport = require("passport");

const bodyparser = require("body-parser");

//Import Schemas for Route Usage
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transaction");
const accRoutes = require("./routes/account");

//Middlewares
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

//Handle CORS
app.use(cors());

//Use Routes
app.use("/users", userRoutes);
app.use("/transaction", transactionRoutes);
app.use("/account", accRoutes);

//Default Error Handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
