/*
  Warnings:

  - You are about to drop the column `df_su_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cm_su_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_df_su_id_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_session_user_id_fkey`;

-- DropIndex
DROP INDEX `comments_df_su_id_fkey` ON `comments`;

-- AlterTable
ALTER TABLE `comments` DROP COLUMN `df_su_id`,
    DROP COLUMN `status`,
    ADD COLUMN `cm_status` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `cm_su_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `session`;

-- CreateTable
CREATE TABLE `sessions` (
    `ss_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ss_user_id` INTEGER NOT NULL,
    `ss_token` VARCHAR(191) NOT NULL,
    `ss_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ss_expires_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_ss_user_id_key`(`ss_user_id`),
    UNIQUE INDEX `sessions_ss_token_key`(`ss_token`),
    PRIMARY KEY (`ss_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_ss_user_id_fkey` FOREIGN KEY (`ss_user_id`) REFERENCES `users`(`us_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_cm_su_id_fkey` FOREIGN KEY (`cm_su_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
