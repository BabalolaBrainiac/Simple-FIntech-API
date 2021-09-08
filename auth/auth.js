const errors = require("restify-errors");

//Revoke Access to Non-Users

export default function (req, res, next) {
  if (req.isAuthenticated()) return next();
  return next(
    new errors.UnauthorizedError(
      "You are not authorized to perform this Operation. Kindly login to continue"
    )
  );
}
