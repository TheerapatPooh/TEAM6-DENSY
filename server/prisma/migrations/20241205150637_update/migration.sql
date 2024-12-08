-- AlterTable
ALTER TABLE `users` ADD COLUMN `us_active` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `_user` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_user_AB_unique`(`A`, `B`),
    INDEX `_user_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_user` ADD CONSTRAINT `_user_A_fkey` FOREIGN KEY (`A`) REFERENCES `checklists`(`cl_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user` ADD CONSTRAINT `_user_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`us_id`) ON DELETE CASCADE ON UPDATE CASCADE;
