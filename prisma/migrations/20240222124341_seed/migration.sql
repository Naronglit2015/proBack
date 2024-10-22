/*
  Warnings:

  - Added the required column `payment` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchases` ADD COLUMN `payment` VARCHAR(191) NOT NULL,
    ADD COLUMN `quantity` DOUBLE NOT NULL;
