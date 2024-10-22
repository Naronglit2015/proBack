/*
  Warnings:

  - You are about to drop the column `userId` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `products_userId_fkey` ON `products`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `userId`;
