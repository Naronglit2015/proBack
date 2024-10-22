/*
  Warnings:

  - Added the required column `imgprofile` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchases` ADD COLUMN `status` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `imgprofile` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;
