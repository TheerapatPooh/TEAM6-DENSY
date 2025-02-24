-- CreateTable
CREATE TABLE `Session` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_user_id` INTEGER NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `session_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `session_expires_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_session_user_id_key`(`session_user_id`),
    UNIQUE INDEX `Session_session_token_key`(`session_token`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_session_user_id_fkey` FOREIGN KEY (`session_user_id`) REFERENCES `users`(`us_id`) ON DELETE CASCADE ON UPDATE CASCADE;
