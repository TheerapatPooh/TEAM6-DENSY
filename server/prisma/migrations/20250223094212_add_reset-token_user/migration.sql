-- AlterTable
ALTER TABLE `users` ADD COLUMN `us_reset_token` VARCHAR(191) NULL,
    ADD COLUMN `us_reset_token_expires` DATETIME(3) NULL;
