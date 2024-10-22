/*
  Warnings:

  - Added the required column `date` to the `table_reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `table_reservations` ADD COLUMN `date` DATETIME(3) NOT NULL;
