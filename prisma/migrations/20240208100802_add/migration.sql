-- CreateTable
CREATE TABLE `confirms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,
    `tableReservationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `confirms` ADD CONSTRAINT `confirms_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `confirms` ADD CONSTRAINT `confirms_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `confirms` ADD CONSTRAINT `confirms_tableReservationId_fkey` FOREIGN KEY (`tableReservationId`) REFERENCES `table_reservations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
