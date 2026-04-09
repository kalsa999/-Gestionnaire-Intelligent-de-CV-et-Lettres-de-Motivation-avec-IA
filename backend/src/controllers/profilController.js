const prisma = require("../prisma");
const { success } = require("../utils/apiResponse");

// ================================================================
// profilController.js — إدارة الملفات الشخصية للمرشحين
// ================================================================

// POST /api/profils — إنشاء ملف شخصي جديد
const createProfilController = async (req, res, next) => {
  try {
    const { titre, competences, experience, formation, isDefault } = req.body;

    // إذا أراد تعيين هذا كافتراضي، نلغي الافتراضي السابق أولاً
    if (isDefault) {
      await prisma.profil.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const profil = await prisma.profil.create({
      data: {
        titre,
        competences: competences || [],
        experience,
        formation,
        isDefault: isDefault || false,
        userId: req.user.id,
      },
    });

    return success(res, profil, "Profil créé avec succès", 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/profils — جلب كل ملفات المستخدم
const getProfilsController = async (req, res, next) => {
  try {
    const profils = await prisma.profil.findMany({
      where: { userId: req.user.id },
      orderBy: [
        { isDefault: "desc" }, // الافتراضي أولاً
        { createdAt: "desc" },
      ],
    });
    return success(res, profils);
  } catch (err) {
    next(err);
  }
};

// PUT /api/profils/:id — تحديث ملف شخصي
const updateProfilController = async (req, res, next) => {
  try {
    const { titre, competences, experience, formation, isDefault } = req.body;

    // التحقق من الملكية
    const existing = await prisma.profil.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      const err = new Error("Profil introuvable");
      err.statusCode = 404;
      throw err;
    }

    if (isDefault) {
      await prisma.profil.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const profil = await prisma.profil.update({
      where: { id: req.params.id },
      data: {
        ...(titre && { titre }),
        ...(competences && { competences }),
        ...(experience !== undefined && { experience }),
        ...(formation !== undefined && { formation }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return success(res, profil, "Profil mis à jour");
  } catch (err) {
    next(err);
  }
};

// DELETE /api/profils/:id — حذف ملف شخصي
const deleteProfilController = async (req, res, next) => {
  try {
    const existing = await prisma.profil.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      const err = new Error("Profil introuvable");
      err.statusCode = 404;
      throw err;
    }

    await prisma.profil.delete({ where: { id: req.params.id } });
    return success(res, null, "Profil supprimé");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProfilController,
  getProfilsController,
  updateProfilController,
  deleteProfilController,
};
