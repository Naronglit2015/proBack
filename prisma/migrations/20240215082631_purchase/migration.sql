/*
  Warnings:

  - You are about to drop the column `quantity` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `tableReservationId` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the `confirms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `confirms` DROP FOREIGN KEY `confirms_productId_fkey`;

-- DropForeignKey
ALTER TABLE `confirms` DROP FOREIGN KEY `confirms_tableReservationId_fkey`;

-- DropForeignKey
ALTER TABLE `confirms` DROP FOREIGN KEY `confirms_username_fkey`;

-- DropForeignKey
ALTER TABLE `purchases` DROP FOREIGN KEY `purchases_productId_fkey`;

-- DropForeignKey
ALTER TABLE `purchases` DROP FOREIGN KEY `purchases_tableReservationId_fkey`;

-- AlterTable
ALTER TABLE `purchases` DROP COLUMN `quantity`,
    DROP COLUMN `tableReservationId`,
    DROP COLUMN `totalPrice`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL,
    MODIFY `productId` INTEGER NULL;

-- DropTable
DROP TABLE `confirms`;

-- AddForeignKey
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
