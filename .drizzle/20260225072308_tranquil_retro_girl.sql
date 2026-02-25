ALTER TABLE "beneficiary" ADD COLUMN "provider_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "provider_generated_bill" ADD COLUMN "added_by" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_provider_id_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_generated_bill" ADD CONSTRAINT "provider_generated_bill_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "provider_user_unique" ON "beneficiary" USING btree ("provider_id","user_id");