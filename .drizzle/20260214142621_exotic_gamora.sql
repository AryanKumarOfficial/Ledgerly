CREATE TABLE "beneficiary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_beneficiary_id_beneficiary_id_fk" FOREIGN KEY ("beneficiary_id") REFERENCES "public"."beneficiary"("id") ON DELETE no action ON UPDATE no action;