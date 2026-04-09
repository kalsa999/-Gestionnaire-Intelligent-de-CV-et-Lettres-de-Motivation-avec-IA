const { Router } = require("express");
const { body } = require("express-validator");
const {
  createProfilController,
  getProfilsController,
  updateProfilController,
  deleteProfilController,
} = require("../controllers/profilController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");

const router = Router();

// All routes are protected
router.use(authMiddleware);

// POST /api/profils
router.post(
  "/",
  [
    body("titre").trim().notEmpty().withMessage("Le titre du profil est requis"),
    body("competences")
      .optional()
      .isArray()
      .withMessage("Les compétences doivent être un tableau"),
  ],
  validate,
  createProfilController
);

// GET /api/profils
router.get("/", getProfilsController);

// PUT /api/profils/:id
router.put("/:id", updateProfilController);

// DELETE /api/profils/:id
router.delete("/:id", deleteProfilController);

module.exports = router;
