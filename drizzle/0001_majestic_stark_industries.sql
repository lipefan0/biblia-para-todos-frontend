CREATE TABLE `reading_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`verse_id` bigint NOT NULL,
	`book_name` varchar(100) NOT NULL,
	`book_abreviation` varchar(10) NOT NULL,
	`chapter_number` int NOT NULL,
	`verse_number` int NOT NULL,
	`read_at` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reading_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`plan` enum('FREE','AI_PREMIUM') NOT NULL DEFAULT 'FREE',
	`active` int NOT NULL DEFAULT 1,
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `reading_progress` ADD CONSTRAINT `reading_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;