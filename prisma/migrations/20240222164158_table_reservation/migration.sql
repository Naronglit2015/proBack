/*
  Warnings:

  - Added the required column `username` to the `table_reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `table_reservations` ADD COLUMN `username` VARCHAR(191) NOT NULL;
