const express = require("express");
const router = express.Router();

router.post("/fundsuccess", (req, res) => {
  const { notification } = req.body;
  console.log(notification);
  res.status(200).json("Your Account has been Successfully Funded");
});

router.post("/transsuccess", async (req, res) => {
  const { notification } = req.body;
  console.log(notification);
  res.status(200).json("Transfer Successfully Completed");
});
