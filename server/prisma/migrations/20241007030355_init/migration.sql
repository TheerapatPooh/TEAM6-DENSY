-- CreateTable
CREATE TABLE `users` (
    `us_id` INTEGER NOT NULL AUTO_INCREMENT,
    `us_username` VARCHAR(191) NOT NULL,
    `us_email` VARCHAR(191) NULL,
    `us_password` VARCHAR(191) NOT NULL,
    `us_role` ENUM('ADMIN', 'INSPECTOR', 'RESPONSIBLEMAN', 'OFFICER') NOT NULL,
    `us_department` VARCHAR(191) NULL,
    `us_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_us_username_key`(`us_username`),
    UNIQUE INDEX `users_us_email_key`(`us_email`),
    PRIMARY KEY (`us_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `defects` (
    `df_id` INTEGER NOT NULL AUTO_INCREMENT,
    `df_title` VARCHAR(191) NOT NULL,
    `df_note` VARCHAR(191) NOT NULL,
    `df_type` VARCHAR(191) NOT NULL,
    `df_status` ENUM('Reported', 'InProgress', 'PendingInspection', 'Resolved', 'Completed') NOT NULL,
    `df_timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `df_us_id` INTEGER NOT NULL,

    PRIMARY KEY (`df_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `nt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nt_message` VARCHAR(191) NOT NULL,
    `nt_status` BOOLEAN NOT NULL,
    `nt_timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nt_us_id` INTEGER NOT NULL,

    PRIMARY KEY (`nt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `pf_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pf_name` VARCHAR(191) NULL,
    `pf_age` INTEGER NULL,
    `pf_tel` VARCHAR(191) NULL,
    `pf_address` VARCHAR(191) NULL,
    `pf_us_id` INTEGER NOT NULL,

    UNIQUE INDEX `profiles_pf_us_id_key`(`pf_us_id`),
    PRIMARY KEY (`pf_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patrols` (
    `pt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pt_date` DATETIME(3) NOT NULL,
    `pt_start_time` DATETIME(3) NULL,
    `pt_end_time` DATETIME(3) NULL,
    `pt_duration` VARCHAR(191) NULL,
    `pt_status` ENUM('Pending', 'Scheduled', 'OnGoing', 'Completed') NOT NULL,
    `pt_ps_id` INTEGER NOT NULL,

    PRIMARY KEY (`pt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patrol_checklists` (
    `ptcl_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ptcl_pt_id` INTEGER NOT NULL,
    `ptcl_cl_id` INTEGER NOT NULL,
    `ptcl_us_id` INTEGER NOT NULL,

    INDEX `patrol_checklists_ptcl_pt_id_ptcl_cl_id_ptcl_us_id_idx`(`ptcl_pt_id`, `ptcl_cl_id`, `ptcl_us_id`),
    PRIMARY KEY (`ptcl_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presets` (
    `ps_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ps_title` VARCHAR(191) NOT NULL,
    `ps_description` VARCHAR(191) NOT NULL,
    `ps_version` INTEGER NOT NULL,
    `ps_latest` BOOLEAN NOT NULL,
    `ps_update_at` DATETIME(3) NOT NULL,
    `ps_us_id` INTEGER NOT NULL,

    PRIMARY KEY (`ps_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preset_checklists` (
    `pscl_ps_id` INTEGER NOT NULL,
    `pscl_cl_id` INTEGER NOT NULL,

    PRIMARY KEY (`pscl_ps_id`, `pscl_cl_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklists` (
    `cl_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cl_title` VARCHAR(191) NOT NULL,
    `cl_version` INTEGER NOT NULL,
    `cl_latest` BOOLEAN NOT NULL,
    `cl_update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cl_us_id` INTEGER NOT NULL,

    PRIMARY KEY (`cl_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patrol_results` (
    `pr_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pr_status` BOOLEAN NOT NULL,
    `pr_it_id` INTEGER NOT NULL,
    `pr_df_id` INTEGER NOT NULL,
    `pr_pt_id` INTEGER NOT NULL,

    PRIMARY KEY (`pr_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `it_id` INTEGER NOT NULL AUTO_INCREMENT,
    `it_name` VARCHAR(191) NOT NULL,
    `it_type` ENUM('Safety', 'Environment', 'Maintenance') NOT NULL,
    `it_cl_id` INTEGER NOT NULL,

    PRIMARY KEY (`it_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zones` (
    `ze_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ze_name` VARCHAR(191) NOT NULL,
    `ze_lt_id` INTEGER NOT NULL,
    `ze_us_id` INTEGER NOT NULL,

    PRIMARY KEY (`ze_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_zones` (
    `iz_it_id` INTEGER NOT NULL,
    `iz_ze_id` INTEGER NOT NULL,

    PRIMARY KEY (`iz_it_id`, `iz_ze_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `lt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `lt_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`lt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `cm_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cm_message` VARCHAR(191) NOT NULL,
    `cm_timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cm_us_id` INTEGER NOT NULL,
    `cm_pr_id` INTEGER NOT NULL,

    PRIMARY KEY (`cm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `im_id` INTEGER NOT NULL AUTO_INCREMENT,
    `im_path` VARCHAR(191) NOT NULL,
    `im_timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `im_pf_id` INTEGER NOT NULL,

    UNIQUE INDEX `images_im_pf_id_key`(`im_pf_id`),
    PRIMARY KEY (`im_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `defect_images` (
    `dfim_df_id` INTEGER NOT NULL,
    `dfim_im_id` INTEGER NOT NULL,

    PRIMARY KEY (`dfim_df_id`, `dfim_im_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `defects` ADD CONSTRAINT `defects_df_us_id_fkey` FOREIGN KEY (`df_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_nt_us_id_fkey` FOREIGN KEY (`nt_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_pf_us_id_fkey` FOREIGN KEY (`pf_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrols` ADD CONSTRAINT `patrols_pt_ps_id_fkey` FOREIGN KEY (`pt_ps_id`) REFERENCES `presets`(`ps_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrol_checklists` ADD CONSTRAINT `patrol_checklists_ptcl_pt_id_fkey` FOREIGN KEY (`ptcl_pt_id`) REFERENCES `patrols`(`pt_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrol_checklists` ADD CONSTRAINT `patrol_checklists_ptcl_cl_id_fkey` FOREIGN KEY (`ptcl_cl_id`) REFERENCES `checklists`(`cl_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrol_checklists` ADD CONSTRAINT `patrol_checklists_ptcl_us_id_fkey` FOREIGN KEY (`ptcl_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presets` ADD CONSTRAINT `presets_ps_us_id_fkey` FOREIGN KEY (`ps_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preset_checklists` ADD CONSTRAINT `preset_checklists_pscl_ps_id_fkey` FOREIGN KEY (`pscl_ps_id`) REFERENCES `presets`(`ps_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preset_checklists` ADD CONSTRAINT `preset_checklists_pscl_cl_id_fkey` FOREIGN KEY (`pscl_cl_id`) REFERENCES `checklists`(`cl_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checklists` ADD CONSTRAINT `checklists_cl_us_id_fkey` FOREIGN KEY (`cl_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrol_results` ADD CONSTRAINT `patrol_results_pr_it_id_fkey` FOREIGN KEY (`pr_it_id`) REFERENCES `items`(`it_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrol_results` ADD CONSTRAINT `patrol_results_pr_df_id_fkey` FOREIGN KEY (`pr_df_id`) REFERENCES `defects`(`df_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrol_results` ADD CONSTRAINT `patrol_results_pr_pt_id_fkey` FOREIGN KEY (`pr_pt_id`) REFERENCES `patrols`(`pt_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_it_cl_id_fkey` FOREIGN KEY (`it_cl_id`) REFERENCES `checklists`(`cl_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zones` ADD CONSTRAINT `zones_ze_lt_id_fkey` FOREIGN KEY (`ze_lt_id`) REFERENCES `locations`(`lt_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zones` ADD CONSTRAINT `zones_ze_us_id_fkey` FOREIGN KEY (`ze_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_zones` ADD CONSTRAINT `item_zones_iz_it_id_fkey` FOREIGN KEY (`iz_it_id`) REFERENCES `items`(`it_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_zones` ADD CONSTRAINT `item_zones_iz_ze_id_fkey` FOREIGN KEY (`iz_ze_id`) REFERENCES `zones`(`ze_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_cm_us_id_fkey` FOREIGN KEY (`cm_us_id`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_cm_pr_id_fkey` FOREIGN KEY (`cm_pr_id`) REFERENCES `patrol_results`(`pr_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_im_pf_id_fkey` FOREIGN KEY (`im_pf_id`) REFERENCES `profiles`(`pf_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `defect_images` ADD CONSTRAINT `defect_images_dfim_df_id_fkey` FOREIGN KEY (`dfim_df_id`) REFERENCES `defects`(`df_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `defect_images` ADD CONSTRAINT `defect_images_dfim_im_id_fkey` FOREIGN KEY (`dfim_im_id`) REFERENCES `images`(`im_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
