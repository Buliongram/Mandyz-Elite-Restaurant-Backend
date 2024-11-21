/*
  Warnings:

  - You are about to alter the column `orderData` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- DropIndex
DROP INDEX `Order_ownerId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` MODIFY `orderData` JSON NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
