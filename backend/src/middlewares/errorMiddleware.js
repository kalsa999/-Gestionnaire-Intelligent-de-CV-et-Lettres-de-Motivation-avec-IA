const logger = require("../utils/logger");

// ================================================================
// errorMiddleware.js — Global Error Handler
//
// Why a global error handler?
// Instead of writing try/catch in every controller, we send the error
// to this middleware via: next(error)
//
// Express knows a middleware with 4 parameters → it's an error handler
// Order: (err, req, res, next)
// ================================================================

const errorMiddleware = (err, req, res, next) => {
  // 1. Log the error
  logger.error(`${err.message}`, { stack: err.stack, url: req.url, method: req.method });

  // 2. Determine the error code (if not specified, use 500)
  const statusCode = err.statusCode || 500;

  // 3. Message setup — We do not show technical details to the user in production
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Une erreur inattendue s'est produite"
      : err.message;

  // 4. Send the response
  res.status(statusCode).json({
    success: false,
    message,
    // Show stack trace only in development for developers
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ================================================================
// notFoundMiddleware — For undefined routes (404)
// Placed before errorMiddleware in index.js
// ================================================================
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.url}' introuvable`,
  });
};

module.exports = { errorMiddleware, notFoundMiddleware };
