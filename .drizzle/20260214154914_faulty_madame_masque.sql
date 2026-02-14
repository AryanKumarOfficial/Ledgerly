ALTER TABLE "transaction" RENAME COLUMN "transactionDate" TO "transaction_date";--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "amount" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "cashback" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "receipt_id" varchar;--> statement-breakpoint
CREATE INDEX "beneficiary_user_idx" ON "beneficiary" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bill_card_idx" ON "bill" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "bill_due_idx" ON "bill" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "category_system_idx" ON "category" USING btree ("isSystem");--> statement-breakpoint
CREATE INDEX "txn_user_idx" ON "transaction" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "txn_card_idx" ON "transaction" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "txn_category_idx" ON "transaction" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "txn_date_idx" ON "transaction" USING btree ("transaction_date");--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_name_unique" UNIQUE("name");