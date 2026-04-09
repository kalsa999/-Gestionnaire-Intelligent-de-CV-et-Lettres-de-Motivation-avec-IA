-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profils` (
    `id` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `competences` JSON NOT NULL,
    `experience` VARCHAR(191) NULL,
    `formation` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lettres` (
    `id` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `poste` VARCHAR(191) NOT NULL,
    `entreprise` VARCHAR(191) NOT NULL,
    `descriptionPoste` VARCHAR(191) NULL,
    `contenu` TEXT NOT NULL,
    `ton` ENUM('PROFESSIONNEL', 'DYNAMIQUE', 'CREATIF', 'FORMEL') NOT NULL DEFAULT 'PROFESSIONNEL',
    `status` ENUM('BROUILLON', 'FINALE', 'ENVOYEE', 'ARCHIVEE') NOT NULL DEFAULT 'BROUILLON',
    `promptUsed` TEXT NULL,
    `modelUsed` VARCHAR(191) NULL,
    `tokensUsed` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `profilId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profils` ADD CONSTRAINT `profils_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lettres` ADD CONSTRAINT `lettres_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lettres` ADD CONSTRAINT `lettres_profilId_fkey` FOREIGN KEY (`profilId`) REFERENCES `profils`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
