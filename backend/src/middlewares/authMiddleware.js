const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");

// ================================================================
// authMiddleware.js — Checking user identity via JWT
//
// How does JWT work?
// 1. User logs in → Server creates an encrypted "token"
// 2. Client (frontend) saves this token
// 3. In each protected request, the client sends: Authorization: Bearer <token>
// 4. This middleware verifies the token's validity
// ================================================================

const authMiddleware = (req, res, next) => {
  // 1. Extract the token from the header
  const authHeader = req.headers["authorization"];

  // Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Token manquant ou format invalide", 401);
  }

  // 2. Extract the token (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 3. Decrypt the token and verify its signature
    // jwt.verify throws an error automatically if:
    //   - The token is forged
    //   - The token has expired
    //   - The token is corrupted
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Add user data to the request
    // Now controllers can access req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    // 5. Move to the next controller
    next();
  } catch (err) {
    // TokenExpiredError → The token has expired
    if (err.name === "TokenExpiredError") {
      return error(res, "Token expiré, veuillez vous reconnecter", 401);
    }
    // JsonWebTokenError → The token is invalid
    return error(res, "Token invalide", 401);
  }
};

module.exports = authMiddleware;
