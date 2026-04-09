const lettreService = require("../services/lettreService");
const { success, paginated } = require("../utils/apiResponse");

// ================================================================
// lettreController.js — إدارة رسائل التحفيز
// ================================================================

// POST /api/lettres — توليد رسالة جديدة
const createLettreController = async (req, res, next) => {
  try {
    const { titre, poste, entreprise, descriptionPoste, profilId, ton } = req.body;
    const lettre = await lettreService.createLettre({
      userId: req.user.id,
      titre,
      poste,
      entreprise,
      descriptionPoste,
      profilId,
      ton,
    });
    return success(res, lettre, "Lettre générée avec succès", 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/lettres — جلب كل رسائل المستخدم
const getLettresController = async (req, res, next) => {
  try {
    const { lettres, total, page, limit } = await lettreService.getLettresByUser(
      req.user.id,
      req.query
    );
    return paginated(res, lettres, { page, limit, total });
  } catch (err) {
    next(err);
  }
};

// GET /api/lettres/:id — جلب رسالة واحدة
const getLettreController = async (req, res, next) => {
  try {
    const lettre = await lettreService.getLettreById(req.params.id, req.user.id);
    return success(res, lettre);
  } catch (err) {
    next(err);
  }
};

// PUT /api/lettres/:id — تحديث رسالة
const updateLettreController = async (req, res, next) => {
  try {
    const lettre = await lettreService.updateLettre(req.params.id, req.user.id, req.body);
    return success(res, lettre, "Lettre mise à jour");
  } catch (err) {
    next(err);
  }
};

// DELETE /api/lettres/:id — حذف رسالة
const deleteLettreController = async (req, res, next) => {
  try {
    await lettreService.deleteLettre(req.params.id, req.user.id);
    return success(res, null, "Lettre supprimée");
  } catch (err) {
    next(err);
  }
};

// POST /api/lettres/:id/regenerate — إعادة توليد رسالة
const regenerateLettreController = async (req, res, next) => {
  try {
    const lettre = await lettreService.regenerateLettre(req.params.id, req.user.id);
    return success(res, lettre, "Lettre régénérée avec succès");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLettreController,
  getLettresController,
  getLettreController,
  updateLettreController,
  deleteLettreController,
  regenerateLettreController,
};
