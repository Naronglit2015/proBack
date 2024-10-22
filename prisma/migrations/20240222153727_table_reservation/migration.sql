/*
  Warnings:

  - You are about to alter the column `tableNumber` on the `table_reservations` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `status` on the `table_reservations` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `table_reservations` MODIFY `tableNumber` DOUBLE NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;
