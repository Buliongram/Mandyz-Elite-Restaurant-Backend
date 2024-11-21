-- DropIndex
DROP INDEX `Order_ownerId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` MODIFY `orderData` LONGTEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
