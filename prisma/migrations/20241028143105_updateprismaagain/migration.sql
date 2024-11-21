/*
  Warnings:

  - You are about to drop the column `category` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `order` table. All the data in the column will be lost.
  - Added the required column `orderData` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Order_ownerId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `category`,
    DROP COLUMN `description`,
    DROP COLUMN `details`,
    DROP COLUMN `images`,
    DROP COLUMN `name`,
    DROP COLUMN `price`,
    ADD COLUMN `orderData` JSON NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
