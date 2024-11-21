/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `address_ownerId_key` ON `address`(`ownerId`);
