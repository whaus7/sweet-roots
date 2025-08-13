const { pool } = require("./database");

const forceDatabaseRefresh = async () => {
  try {
    const client = await pool.connect();

    console.log("🔄 Starting database refresh...");

    // Drop existing tables in correct order (respecting foreign keys)
    console.log("🗑️ Dropping existing tables...");
    await client.query("DROP TABLE IF EXISTS brix_readings CASCADE");
    await client.query("DROP TABLE IF EXISTS plant_reference CASCADE");
    await client.query("DROP TABLE IF EXISTS users CASCADE");

    console.log("✅ Tables dropped successfully");

    // Re-run the initialization
    const { initializeDatabase } = require("./database");
    await initializeDatabase();

    console.log("✅ Database refreshed successfully!");

    client.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error refreshing database:", error);
    process.exit(1);
  }
};

forceDatabaseRefresh();
