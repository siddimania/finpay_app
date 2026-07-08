import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schemaFilter: ["public"],
  schema: "./db/schema/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_SESSION_POOLER_DATABASE_URL!,
  },
});
