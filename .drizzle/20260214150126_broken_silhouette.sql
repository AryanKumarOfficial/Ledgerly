CREATE TYPE "public"."bill_status" AS ENUM('PENDING', 'PAID', 'PARTIALLY_PAID');--> statement-breakpoint
CREATE TABLE "bill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"min_due" numeric(12, 2),
	"due_date" date NOT NULL,
	"status" "bill_status" NOT NULL,
	"paid_amount" numeric(12, 2) DEFAULT '0.0',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bill" ADD CONSTRAINT "bill_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE no action ON UPDATE cascade;