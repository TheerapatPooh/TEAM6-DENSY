/*
  Warnings:

  - You are about to drop the `_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_user` DROP FOREIGN KEY `_user_A_fkey`;

-- DropForeignKey
ALTER TABLE `_user` DROP FOREIGN KEY `_user_B_fkey`;

-- DropTable
DROP TABLE `_user`;


ALTER TABLE `users` 
MODIFY COLUMN `us_username` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;

ALTER TABLE `users` 
MODIFY COLUMN `us_password` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;
