/*
  Warnings:

  - You are about to drop the column `productId` on the `purchases` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `purchases` DROP FOREIGN KEY `purchases_productId_fkey`;

-- AlterTable
ALTER TABLE `purchases` DROP COLUMN `productId`;
