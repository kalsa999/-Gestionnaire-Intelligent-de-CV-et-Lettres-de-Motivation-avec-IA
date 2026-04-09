const prisma = require("../prisma");
const { generateLetter } = require("./aiService");
const { getPaginationParams } = require("../utils/helpers");

// ================================================================
// lettreService.js — منطق إدارة رسائل التحفيز (CRUD + IA)
//
// This service mediates between:
//   - lettreController (receives requests)
//   - prisma (database)
//   - aiService (artificial intelligence)
// ================================================================

/**
 * Generate and save a new cover letter
 */
const createLettre = async ({ userId, titre, poste, entreprise, descriptionPoste, profilId, ton }) => {
  // 1. Get the candidate's profile if requested
  let profil = null;
  if (profilId) {
    profil = await prisma.profil.findFirst({
      where: { id: profilId, userId }, // Check that the profile belongs to the user
    });
    if (!profil) {
      const err = new Error("Profil introuvable");
      err.statusCode = 404;
      throw err;
    }
  }

  // 2. Generate the letter using AI
  const { contenu, promptUsed, tokensUsed, modelUsed } = await generateLetter({
    poste,
    entreprise,
    descriptionPoste,
    profil,
    ton,
  });

  // 3. Save the letter to the database
  const lettre = await prisma.lettre.create({
    data: {
      titre,
      poste,
      entreprise,
      descriptionPoste,
      contenu,
      ton,
      promptUsed,
      tokensUsed,
      modelUsed,
      userId,
      profilId: profilId || null,
    },
  });

  return lettre;
};

/**
 * Get all user letters with pagination
 */
const getLettresByUser = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);

  // Get letters and total count at the same time (Promise.all → faster)
  const [lettres, total] = await Promise.all([
    prisma.lettre.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // Newest first
      skip,
      take: limit,
      // Don't return the full content in the list (heavy) — only in details
      select: {
        id: true,
        titre: true,
        poste: true,
        entreprise: true,
        ton: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.lettre.count({ where: { userId } }),
  ]);

  return { lettres, total, page, limit };
};

/**
 * Get a single letter with full details
 */
const getLettreById = async (id, userId) => {
  const lettre = await prisma.lettre.findFirst({
    where: { id, userId }, // Check that the letter belongs to the user
    include: { profil: true }, // Get the associated profile data
  });

  if (!lettre) {
    const err = new Error("Lettre introuvable");
    err.statusCode = 404;
    throw err;
  }

  return lettre;
};

/**
 * Update a letter (title, status, or content)
 */
const updateLettre = async (id, userId, data) => {
  // Check ownership first
  await getLettreById(id, userId);

  return prisma.lettre.update({
    where: { id },
    data: {
      ...(data.titre && { titre: data.titre }),
      ...(data.contenu && { contenu: data.contenu }),
      ...(data.status && { status: data.status }),
    },
  });
};

/**
 * حذف رسالة
 */
const deleteLettre = async (id, userId) => {
  // Check ownership first
  await getLettreById(id, userId);

  // Then delete the letter

  await prisma.lettre.delete({ where: { id } });
};

/**
 * Regenerate a letter using AI
 */
const regenerateLettre = async (id, userId) => {
  const lettre = await getLettreById(id, userId);

  let profil = null;
  if (lettre.profilId) {
    profil = await prisma.profil.findUnique({ where: { id: lettre.profilId } });
  }

  const { contenu, promptUsed, tokensUsed, modelUsed } = await generateLetter({
    poste: lettre.poste,
    entreprise: lettre.entreprise,
    descriptionPoste: lettre.descriptionPoste,
    profil,
    ton: lettre.ton,
  });

  return prisma.lettre.update({
    where: { id },
    data: { contenu, promptUsed, tokensUsed, modelUsed },
  });
};

module.exports = { createLettre, getLettresByUser, getLettreById, updateLettre, deleteLettre, regenerateLettre };
