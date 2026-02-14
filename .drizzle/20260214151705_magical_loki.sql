CREATE TABLE "provider_generated_bill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"min_due" numeric(12, 2),
	"verified_match" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DROP INDEX "user_id";--> statement-breakpoint
DROP INDEX "card_number_masked";--> statement-breakpoint
ALTER TABLE "card" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "card" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "provider_generated_bill" ADD CONSTRAINT "provider_generated_bill_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "provider_bill_card_idx" ON "provider_generated_bill" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "card_user_idx" ON "card" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "card_mask_idx" ON "card" USING btree ("credit_number_masked");--> statement-breakpoint
ALTER TABLE "card" DROP COLUMN "provider_id";