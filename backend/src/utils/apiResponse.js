// ================================================================
// apiResponse.js — unified format for all API responses
//
// Why? Without this, each controller responds differently:
//   res.json({ data: ... })    ← controller 1
//   res.json({ result: ... })  ← controller 2
//   res.json({ user: ... })    ← controller 3
//
// With this file, all responses have the same format:
//   { success: true, message: "...", data: { ... } }
// ================================================================

/**
 * Reply with success
 * @param {object} res - Express response object
 * @param {any} data - Data to send
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP code (200, 201...)
 */
const success = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Reply with error
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP code (400, 401, 404, 500...)
 * @param {array|null} errors - Detailed validation errors (from express-validator)
 */
const error = (res, message = "Internal Server Error", statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  // Add error details only if found (like validation errors)
  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Reply with pagination (for longlists)
 * @param {object} res
 * @param {array} data 
 * @param {object} pagination - { page, limit, total, totalPages }
 */
const paginated = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

module.exports = { success, error, paginated };
