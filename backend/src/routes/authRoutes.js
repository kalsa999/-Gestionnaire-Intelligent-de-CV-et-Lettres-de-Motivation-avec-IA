const { Router } = require("express");
const { body } = require("express-validator");
const { registerController, loginController, getProfileController } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");

// ================================================================
// authRoutes.js — defining authentication endpoints
//
// Order in each route:
//   1. Validation rules (body().isEmail()...)
//   2. validate (checks the results of step 1)
//   3. The Controller
// ================================================================

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Le mot de passe doit contenir au moins 8 caractères")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Le mot de passe doit contenir une majuscule, une minuscule et un chiffre"),
    body("firstName").trim().notEmpty().withMessage("Le prénom est requis"),
    body("lastName").trim().notEmpty().withMessage("Le nom est requis"),
  ],
  validate,
  registerController
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("password").notEmpty().withMessage("Le mot de passe est requis"),
  ],
  validate,
  loginController
);

// GET /api/auth/me  ← protected route (needs JWT)
router.get("/me", authMiddleware, getProfileController);

module.exports = router;
