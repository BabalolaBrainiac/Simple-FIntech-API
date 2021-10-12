const Localstrategy = require("passport-local").Strategy;
const pool = require("../controllers/db");

module.exports = function (passport) {
  //Serialize User
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  //Deserialize User
  passport.deserializeUser(function (id, done) {
    let sql = `SELECT * FROM users WHERE user_id = '${id}'`;
    pool.execute(sql, (err, rows) => {
      done(err, rows[0]);
    });
  });

  //Login
  passport.use(
    "local-signup",
    new LocalStrategy({
      username: "email",
      password: "password",
      passReqToCallback: true, 
    })
  );
};
