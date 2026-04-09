const { Router } = require("express");
const { body, param } = require("express-validator");
const {
  createLettreController,
  getLettresController,
  getLettreController,
  updateLettreController,
  deleteLettreController,
  regenerateLettreController,
} = require("../controllers/lettreController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");

const router = Router();

// All routes here are protected — authMiddleware at the router level
router.use(authMiddleware);

// POST /api/lettres — Generate a new letter
router.post(
  "/",
  [
    body("titre").trim().notEmpty().withMessage("Le titre est requis"),
    body("poste").trim().notEmpty().withMessage("Le poste est requis"),
    body("entreprise").trim().notEmpty().withMessage("L'entreprise est requise"),
    body("ton")
      .optional()
      .isIn(["PROFESSIONNEL", "DYNAMIQUE", "CREATIF", "FORMEL"])
      .withMessage("Ton invalide"),
  ],
  validate,
  createLettreController
);

// GET /api/lettres — List of letters (with pagination: ?page=1&limit=10)
router.get("/", getLettresController);

// GET /api/lettres/:id — Letter details
router.get("/:id", getLettreController);

// PUT /api/lettres/:id — Update letter
router.put(
  "/:id",
  [
    body("status")
      .optional()
      .isIn(["BROUILLON", "FINALE", "ENVOYEE", "ARCHIVEE"])
      .withMessage("Statut invalide"),
  ],
  validate,
  updateLettreController
);

// DELETE /api/lettres/:id — Delete letter
router.delete("/:id", deleteLettreController);

// POST /api/lettres/:id/regenerate — Regenerate with AI
router.post("/:id/regenerate", regenerateLettreController);

module.exports = router;
