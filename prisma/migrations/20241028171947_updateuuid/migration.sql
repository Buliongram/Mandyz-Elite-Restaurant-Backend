-- DropIndex
DROP INDEX `Order_ownerId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` MODIFY `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;