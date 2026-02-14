CREATE TABLE "card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"nick_name" varchar(256) NOT NULL,
	"expiration_date" date NOT NULL,
	"provider_id" varchar NOT NULL,
	"billing_cycle_day" integer NOT NULL,
	"credit_limit" numeric NOT NULL,
	"credit_number_masked" varchar(4) NOT NULL,
	"card_brand" varchar(256),
	CONSTRAINT "card_credit_number_masked_unique" UNIQUE("credit_number_masked")
);
--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "user_id" ON "card" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "card_number_masked" ON "card" USING btree ("credit_number_masked");