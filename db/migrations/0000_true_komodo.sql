CREATE TABLE "merchants" (
	"merchant_id" text PRIMARY KEY NOT NULL,
	"merchant_name" text NOT NULL,
	"merchant_email" text NOT NULL,
	"merchant_phone" text NOT NULL,
	"merchant_address" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"refund_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"status" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"transaction_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"merchant_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"payment_method" text NOT NULL,
	"payment_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_transaction_id_transactions_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("transaction_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_merchant_id_merchants_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("merchant_id") ON DELETE no action ON UPDATE no action;