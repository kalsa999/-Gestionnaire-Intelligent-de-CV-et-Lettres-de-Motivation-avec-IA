const { validationResult } = require("express-validator");
const { error } = require("../utils/apiResponse");

// ================================================================
// validationMiddleware.js — Validating incoming data
//
// How it works with express-validator?
// 1. In the route, we set validation rules (e.g., email must be valid)
// 2. This middleware collects all errors and sends them at once
// ================================================================

const validate = (req, res, next) => {
  // validationResult collects all errors from the rules defined in the route
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors to be clear to the frontend
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,   // Field with error (e.g., "email")
      message: err.msg,  // Error message (e.g., "Invalid email")
    }));

    return error(res, "Données invalides", 422, formattedErrors);
  }

  // If everything is valid, move to the controller
  next();
};

module.exports = validate;
