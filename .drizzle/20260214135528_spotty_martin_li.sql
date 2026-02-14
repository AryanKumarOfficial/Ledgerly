CREATE TABLE "transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"beneficiary_id" uuid NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"merchant_name" varchar(256),
	"amount" numeric,
	"cashback" numeric,
	"title" varchar(256) NOT NULL,
	"description" text,
	"category_id" uuid NOT NULL,
	"type" varchar(256),
	"isVerified" boolean DEFAULT false,
	"transactionDate" date DEFAULT now(),
	"receipt_url" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;