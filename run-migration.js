const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log("Running blogs table migration...");

    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "supabase",
      "migrations",
      "001_create_blogs_table.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Execute the migration
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSQL });

    if (error) {
      console.error("Migration failed:", error);

      // Try to run each statement separately
      const statements = migrationSQL
        .split(";")
        .filter((stmt) => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          console.log("Executing:", statement.trim().substring(0, 50) + "...");
          const { error: stmtError } = await supabase.rpc("exec_sql", {
            sql: statement.trim() + ";",
          });
          if (stmtError) {
            console.error("Statement failed:", stmtError);
            console.error("Statement was:", statement.trim());
          } else {
            console.log("✓ Statement executed successfully");
          }
        }
      }
    } else {
      console.log("✓ Migration completed successfully");
    }

    // Test the table exists
    const { data, error: testError } = await supabase
      .from("blogs")
      .select("count(*)")
      .limit(1);

    if (testError) {
      console.error("Table test failed:", testError);
    } else {
      console.log("✓ Blogs table is accessible");
    }
  } catch (err) {
    console.error("Error running migration:", err);
  }
}

runMigration();
