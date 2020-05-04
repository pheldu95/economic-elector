-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

--create a database called 'economic_elector'

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "admin" boolean 
);

CREATE TABLE "elections"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR, 
	"date" date,
	"location" VARCHAR
);

CREATE TABLE "candidates"(
	"id" SERIAL PRIMARY KEY,
	"election_id" integer REFERENCES "elections",
	"name" VARCHAR,
	"running_for" VARCHAR,
	"email" VARCHAR,
	"incumbent" boolean
);

CREATE TABLE "budget_categories"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR,
	"past_allocation" INT,
	"election_id" integer REFERENCES "elections"

);


CREATE TABLE "budget_allocation"(
	"id" SERIAL PRIMARY KEY,
	"candidate_id" integer REFERENCES "candidates",
	"budget_category_id" integer REFERENCES "budget_categories",
	"amount" INT
);