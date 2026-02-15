ALTER TABLE "verification_token" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."verification_type";--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('EMAIL_VERIFY', 'PASSWORD_RESET', 'MAGIL_LINK');--> statement-breakpoint
ALTER TABLE "verification_token" ALTER COLUMN "type" SET DATA TYPE "public"."verification_type" USING "type"::"public"."verification_type";--> statement-breakpoint
ALTER TABLE "verification_token" ALTER COLUMN "created_at" DROP NOT NULL;