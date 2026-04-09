const OpenAI = require("openai");
const { buildCoverLetterPrompt } = require("../utils/helpers");
const logger = require("../utils/logger");

// ================================================================
// aiService.js — Communicating with OpenAI to generate cover letters
//
// Why separate this into a separate service?
// - If we want to switch from OpenAI to Gemini, we only modify here
// - The rest of the code is not affected
// ================================================================

// Create a single OpenAI client (singleton)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,  // 60 secondes max par requête
  maxRetries: 1,
});

/**
 * Generate a cover letter using AI
 *
 * @param {object} params - Letter generation parameters
 * @param {string} params.poste - Desired position
 * @param {string} params.entreprise - Company name
 * @param {string|null} params.descriptionPoste - Job description
 * @param {object|null} params.profil - Candidate profile
 * @param {string} params.ton - Writing style
 * @returns {{ contenu: string, promptUsed: string, tokensUsed: number, modelUsed: string }}
 */
const generateLetter = async ({ poste, entreprise, descriptionPoste, profil, ton }) => {
  // 1. Build the appropriate prompt
  const prompt = buildCoverLetterPrompt({ poste, entreprise, descriptionPoste, profil, ton });

  logger.info(`Generating a letter for: ${poste} at ${entreprise}`);

  try {
    // 2. Send the request to OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          // System message: defines the AI's personality
          role: "system",
          content:
            "Tu es un expert RH et rédacteur professionnel spécialisé dans les lettres de motivation en français. Tu rédiges des lettres percutantes, personnalisées et adaptées au secteur visé.",
        },
        {
          // User message: the actual request
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: parseInt(process.env.AI_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
      // temperature: 0 = precise and specific | 1 = creative and random | 0.7 = balanced
    });

    // 3. Extract the result
    const contenu = response.choices[0].message.content.trim();
    const tokensUsed = response.usage.total_tokens;
    const modelUsed = response.model;

    logger.info(`Letter generated successfully. Tokens used: ${tokensUsed}`);

    return { contenu, promptUsed: prompt, tokensUsed, modelUsed };
  } catch (err) {
    logger.error(`Erreur OpenAI: ${err.message}`);

    // Convert OpenAI errors into user-friendly errors
    if (err.status === 429) {
      const apiError = new Error("Limite d'API atteinte, réessayez dans quelques instants");
      apiError.statusCode = 429;
      throw apiError;
    }

    if (err.status === 401) {
      logger.warn("Clé API invalide ou compte sans crédit. Utilisation d'une lettre fictive pour le test.");
      return {
        contenu: "Ceci est une lettre de motivation générée automatiquement (Mode Test). \n\nMadame, Monsieur,\n\nJe vous adresse cette candidature pour le poste de " + poste + " au sein de " + entreprise + ". \n\n[Remarque: Mettez une vraie clé API OpenAI dans le fichier .env pour générer de vraies lettres.]",
        promptUsed: prompt,
        tokensUsed: 0,
        modelUsed: "mock-test-model"
      };
    }

    // Timeout ou erreur réseau
    if (err.code === "ETIMEDOUT" || err.name === "APIConnectionTimeoutError" || err.name === "APIConnectionError") {
      const timeoutError = new Error("L'IA met trop de temps à répondre, réessayez dans quelques instants");
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    throw err;
  }
};

module.exports = { generateLetter };
