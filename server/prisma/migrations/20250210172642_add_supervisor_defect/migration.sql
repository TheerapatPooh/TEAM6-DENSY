/*
  Warnings:

  - Added the required column `df_su_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `df_su_id` to the `defects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `zones` DROP FOREIGN KEY `zones_ze_us_id_fkey`;

-- AlterTable
ALTER TABLE `comments` ADD COLUMN `df_su_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `defects` ADD COLUMN `df_su_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `zones` MODIFY `ze_us_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `defects` ADD CONSTRAINT `defects_df_su_id_fkey` FOREIGN KEY (`df_su_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zones` ADD CONSTRAINT `zones_ze_us_id_fkey` FOREIGN KEY (`ze_us_id`) REFERENCES `users`(`us_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_df_su_id_fkey` FOREIGN KEY (`df_su_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
