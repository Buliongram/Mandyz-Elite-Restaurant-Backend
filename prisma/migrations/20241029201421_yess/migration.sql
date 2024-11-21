/*
  Warnings:

  - You are about to drop the column `type` on the `order` table. All the data in the column will be lost.
  - Added the required column `checkoutType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Order_ownerId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `type`,
    ADD COLUMN `checkoutType` VARCHAR(20) NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
