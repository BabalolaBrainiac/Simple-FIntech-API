const bcrypt = require("bcrypt");
const pool = require("./db");

exports.verifyPassword = async (ref, hash) => {
  await bcrypt.compare(ref, hash, (err, result) => {
    if (err) {
      console.log(err);
    } else return result;
  });
};

exports.ensureSufficient = async (sender, amount) => {
    let sql = `FROM users
  WHERE email = '${sender}'
   SELECT IF ('${amount}' >= account_balance, 'sufficient', 'insufficient')
  `;
  await pool.execute(sql, (insufficient, sufficient) => {
    if (insufficient) {
      res
        .status(500)
        .json("You have Insufficient funds to perfom this transaction");
    }
    else if (sufficient) {
      res.redirect("/verify");
    }
  });
  };
  

