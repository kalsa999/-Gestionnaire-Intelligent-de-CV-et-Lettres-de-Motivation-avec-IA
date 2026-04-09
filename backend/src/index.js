require("dotenv").config();
const app = require("./app");
const prisma = require("./prisma");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Connexion à la base de données réussie (Docker MySQL)");

    app.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Impossible de se connecter à la base de données", error);
    process.exit(1);
  }
};

// Dealing with sudden shutdown (Graceful Shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Closing Prisma Client...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
