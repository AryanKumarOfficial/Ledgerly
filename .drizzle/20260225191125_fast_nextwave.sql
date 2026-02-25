DROP INDEX "provider_user_unique";--> statement-breakpoint
ALTER TABLE "beneficiary" ADD COLUMN "card_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "benficiary_card_idx" ON "beneficiary" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "benficiary_provider_idx" ON "beneficiary" USING btree ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_user_card_unique" ON "beneficiary" USING btree ("provider_id","user_id","card_id");