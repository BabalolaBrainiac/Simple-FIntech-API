const express = require("express");
const app = express();
const errors = require("restify-errors");
const morgan = require("morgan");
const cors = require("cors");
const bodyparser = require("body-parser");

//Import Schemas for Route Usage
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transaction");
const accRoutes = require("./routes/account");

//Middlewares
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

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
