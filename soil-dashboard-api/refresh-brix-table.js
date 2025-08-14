const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const refreshBrixTable = async () => {
  try {
    const client = await pool.connect();

    console.log("Starting brix_readings table refresh...");

    // Drop the existing brix_readings table if it exists
    console.log("Dropping existing brix_readings table...");
    await client.query(`
      DROP TABLE IF EXISTS brix_readings CASCADE;
    `);

    // Recreate the brix_readings table with user_id column
    console.log("Creating new brix_readings table with user_id column...");
    await client.query(`
      CREATE TABLE brix_readings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plant_name VARCHAR(100) NOT NULL,
        brix_value DECIMAL(4,1) NOT NULL CHECK (brix_value >= 0 AND brix_value <= 30),
        reading_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ brix_readings table refreshed successfully!");
    console.log("✅ user_id column is now available");

    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Error refreshing brix_readings table:", error);
    process.exit(1);
  }
};

// Run the refresh
refreshBrixTable();
