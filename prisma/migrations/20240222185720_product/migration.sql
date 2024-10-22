/*
  Warnings:

  - Added the required column `img` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `img` VARCHAR(191) NOT NULL;
