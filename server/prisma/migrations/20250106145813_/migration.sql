-- DropForeignKey
ALTER TABLE `zones` DROP FOREIGN KEY `zones_ze_us_id_fkey`;

-- AlterTable
ALTER TABLE `zones` MODIFY `ze_us_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `zones` ADD CONSTRAINT `zones_ze_us_id_fkey` FOREIGN KEY (`ze_us_id`) REFERENCES `users`(`us_id`) ON DELETE SET NULL ON UPDATE CASCADE;
