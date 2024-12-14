/*
  Warnings:

  - You are about to drop the column `df_timestamp` on the `defects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `defects` DROP COLUMN `df_timestamp`,
    ADD COLUMN `df_finish_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `df_start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
