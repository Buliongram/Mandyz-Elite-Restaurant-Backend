/*
  Warnings:

  - Made the column `checkoutType` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Order_ownerId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` MODIFY `checkoutType` VARCHAR(20) NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
