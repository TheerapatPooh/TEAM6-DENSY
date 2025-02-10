/*
  Warnings:

  - Added the required column `pr_su_id` to the `patrol_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patrol_results` ADD COLUMN `pr_su_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `patrol_results` ADD CONSTRAINT `patrol_results_pr_su_id_fkey` FOREIGN KEY (`pr_su_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
