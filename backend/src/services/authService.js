const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const { sanitizeUser } = require("../utils/helpers");

// ================================================================
// authService.js — Registration and login logic
//
// Why separate logic here instead of the controller?
// - Controller is only responsible for: reading the request + sending the response
// - Service is responsible for: business logic
// - This makes the code easier to test and maintain
// ================================================================

/**
 * Register a new user
 */
const register = async ({ email, password, firstName, lastName }) => {
  // 1. Check if email is already used
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const err = new Error("Cet email est déjà utilisé");
    err.statusCode = 409; // Conflict
    throw err;
  }

  // 2. Encrypt password
  // saltRounds = 12 → means 2^12 = 4096 encryption operations (hard for hackers)
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create user in database
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, firstName, lastName },
  });

  // 4. Create tokens
  const tokens = generateTokens(user);

  // 5. Return user without password + tokens
  return { user: sanitizeUser(user), ...tokens };
};

/**
 * Login
 */
const login = async ({ email, password }) => {
  // 1. Find user
  const user = await prisma.user.findUnique({ where: { email } });

  // ✅ Same error message for email and password (security — don't reveal what was wrong)
  if (!user) {
    const err = new Error("Email ou mot de passe incorrect");
    err.statusCode = 401;
    throw err;
  }

  // 2. Compare password with encrypted version
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const err = new Error("Email ou mot de passe incorrect");
    err.statusCode = 401;
    throw err;
  }

  // 3. Create tokens and return data
  const tokens = generateTokens(user);
  return { user: sanitizeUser(user), ...tokens };
};

/**
 * Helper function: Create access token + refresh token
 */
const generateTokens = (user) => {
  // Access Token: short validity (7 days) — for normal access
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  // Refresh Token: long validity (30 days) — to renew access token
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
  );

  return { accessToken, refreshToken };
};

/**
 * Get user profile
 */
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profils: true }, // Include user profiles
  });

  if (!user) {
    const err = new Error("Utilisateur introuvable");
    err.statusCode = 404;
    throw err;
  }

  return sanitizeUser(user);
};

module.exports = { register, login, getProfile };
