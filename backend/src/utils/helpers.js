// helpers.js — helper functions used in many code places
/**
 * @param {object} params
 * @param {string} params.poste 
 * @param {string} params.entreprise
 * @param {string} params.descriptionPoste   
 * @param {object|null} params.profil 
 * @param {string} params.ton 
 * @returns {string}
 */
const buildCoverLetterPrompt = ({ poste, entreprise, descriptionPoste, profil, ton }) => {
  // Convert enum to natural text
  const tonMap = {
    PROFESSIONNEL: "professionnel et formel",
    DYNAMIQUE: "dynamique et enthousiaste",
    CREATIF: "créatif et original",
    FORMEL: "très formel et institutionnel",
  };

  const tonText = tonMap[ton] || "professionnel";

  let prompt = `Tu es un expert en rédaction de lettres de motivation en français.
Rédige une lettre de motivation exceptionnelle et personnalisée.

POSTE VISÉ: ${poste}
ENTREPRISE: ${entreprise}
TON SOUHAITÉ: ${tonText}`;

  // Add job description if any
  if (descriptionPoste) {
    prompt += `\n\nDESCRIPTION DU POSTE:\n${descriptionPoste}`;
  }

  // Add candidate information if profile exists
  if (profil) {
    prompt += `\n\nPROFIL DU CANDIDAT:
- Titre: ${profil.titre}
- Compétences: ${profil.competences.join(", ")}`;

    if (profil.experience) {
      prompt += `\n- Expérience: ${profil.experience}`;
    }
    if (profil.formation) {
      prompt += `\n- Formation: ${profil.formation}`;
    }
  }

  prompt += `

INSTRUCTIONS:
1. La lettre doit faire entre 300 et 400 mots
2. Structure: Introduction percutante → Corps (motivation + compétences) → Conclusion avec call-to-action
3. Ton ${tonText}
4. Ne pas inventer des informations non fournies
5. Utiliser "Madame, Monsieur" si le recruteur n'est pas mentionné
6. Terminer par "Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées."

Génère UNIQUEMENT le texte de la lettre, sans aucun commentaire.`;

  return prompt;
};

/**
 * Calculate the number of words in a text
 */
const countWords = (text) => {
  return text.trim().split(/\s+/).length;
};

/**
 * Remove sensitive information from user object before sending
 */
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

/**
 * Create pagination response from request parameters
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports = {
  buildCoverLetterPrompt,
  countWords,
  sanitizeUser,
  getPaginationParams,
};
