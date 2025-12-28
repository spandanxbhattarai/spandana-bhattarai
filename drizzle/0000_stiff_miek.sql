CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"address" text NOT NULL,
	"price" integer NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
