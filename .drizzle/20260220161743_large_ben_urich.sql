CREATE TABLE "card_reveal_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(512),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "card" DROP CONSTRAINT "card_credit_number_masked_unique";--> statement-breakpoint
ALTER TABLE "card_reveal_log" ADD CONSTRAINT "card_reveal_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_reveal_log" ADD CONSTRAINT "card_reveal_log_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reveal_user_idx" ON "card_reveal_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reveal_card_idx" ON "card_reveal_log" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "reveal_time_idx" ON "card_reveal_log" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_card_unique" ON "card" USING btree ("user_id","credit_number_masked");