/*
  Warnings:

  - Added the required column `table` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchases` ADD COLUMN `table` VARCHAR(191) NOT NULL;
