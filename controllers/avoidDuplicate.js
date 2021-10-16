const pool = require("../controllers/db");

exports.avoidDuplicate = async (email) => {
  let sql = `SELECT email FROM users WHERE (email = '${email}')`;
  await pool.execute(sql, (err, userEmail) => {
    if (err) {
      throw err;
    } else if (userEmail.length >= 1) {
      res.status(401).json("Email exists");
    }
  });
};
