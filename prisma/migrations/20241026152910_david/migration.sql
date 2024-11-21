-- CreateTable
CREATE TABLE `address` (
    `addressId` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerId` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(20) NULL,
    `lastname` VARCHAR(20) NULL,
    `primaryPhone` VARCHAR(20) NULL,
    `secondaryPhone` VARCHAR(20) NULL,
    `region` VARCHAR(20) NULL,
    `address` VARCHAR(500) NULL,
    `information` VARCHAR(500) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`addressId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
