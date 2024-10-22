/*
  Warnings:

  - You are about to alter the column `tableNumber` on the `table_reservations` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `table_reservations` MODIFY `tableNumber` VARCHAR(191) NULL;
