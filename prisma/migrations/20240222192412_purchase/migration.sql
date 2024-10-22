/*
  Warnings:

  - Added the required column `img` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchases` ADD COLUMN `img` VARCHAR(191) NOT NULL;
