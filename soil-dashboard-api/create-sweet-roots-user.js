const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const SWEET_ROOTS_FARM_USER_ID = "a7e21794-c0aa-4933-84a6-0b03a41d8ef0";

const createSweetRootsFarmUser = async () => {
  try {
    const client = await pool.connect();

    console.log("Setting up Sweet Roots Farm user and sample data...");

    // Check if user already exists
    let result = await client.query("SELECT * FROM users WHERE id = $1", [
      SWEET_ROOTS_FARM_USER_ID,
    ]);

    if (result.rows.length === 0) {
      // Create Sweet Roots Farm user
      console.log("Creating Sweet Roots Farm user...");
      await client.query(
        `INSERT INTO users (id, email, name, provider, provider_id, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          SWEET_ROOTS_FARM_USER_ID,
          "sweetroots@example.com",
          "Sweet Roots Farm",
          "demo",
          "sweet-roots-farm",
          null,
        ]
      );
      console.log("✅ Sweet Roots Farm user created successfully!");
    } else {
      console.log("✅ Sweet Roots Farm user already exists!");
    }

    // Check if user has any brix readings
    result = await client.query(
      "SELECT COUNT(*) FROM brix_readings WHERE user_id = $1",
      [SWEET_ROOTS_FARM_USER_ID]
    );

    const readingCount = parseInt(result.rows[0].count);

    if (readingCount === 0) {
      // Add sample brix readings for Sweet Roots Farm
      console.log("Adding sample Brix readings for Sweet Roots Farm...");

      const sampleReadings = [
        {
          plant_name: "Spinach",
          brix_value: 8.5,
          reading_date: "2024-01-15",
          notes: "Excellent nutrient density, healthy soil conditions",
        },
        {
          plant_name: "Spinach",
          brix_value: 9.2,
          reading_date: "2024-01-22",
          notes: "Improved after compost application",
        },
        {
          plant_name: "Kale",
          brix_value: 7.8,
          reading_date: "2024-01-15",
          notes: "Good baseline reading",
        },
        {
          plant_name: "Kale",
          brix_value: 8.1,
          reading_date: "2024-01-22",
          notes: "Slight improvement with foliar feeding",
        },
        {
          plant_name: "Carrots",
          brix_value: 6.5,
          reading_date: "2024-01-10",
          notes: "Early season reading, room for improvement",
        },
        {
          plant_name: "Carrots",
          brix_value: 7.2,
          reading_date: "2024-01-20",
          notes: "Better after soil amendment",
        },
        {
          plant_name: "Tomatoes",
          brix_value: 9.8,
          reading_date: "2024-01-18",
          notes: "Excellent flavor and sweetness",
        },
        {
          plant_name: "Bell Peppers",
          brix_value: 8.3,
          reading_date: "2024-01-16",
          notes: "Good color and texture",
        },
      ];

      for (const reading of sampleReadings) {
        await client.query(
          `INSERT INTO brix_readings (user_id, plant_name, brix_value, reading_date, notes)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            SWEET_ROOTS_FARM_USER_ID,
            reading.plant_name,
            reading.brix_value,
            reading.reading_date,
            reading.notes,
          ]
        );
      }

      console.log(
        `✅ Added ${sampleReadings.length} sample Brix readings for Sweet Roots Farm!`
      );
    } else {
      console.log(
        `✅ Sweet Roots Farm already has ${readingCount} Brix readings!`
      );
    }

    // Show summary
    result = await client.query(
      "SELECT plant_name, COUNT(*) as count FROM brix_readings WHERE user_id = $1 GROUP BY plant_name ORDER BY plant_name",
      [SWEET_ROOTS_FARM_USER_ID]
    );

    console.log("\n📊 Sweet Roots Farm Brix Readings Summary:");
    result.rows.forEach((row) => {
      console.log(`  - ${row.plant_name}: ${row.count} readings`);
    });

    client.release();
    await pool.end();

    console.log("\n🎉 Sweet Roots Farm setup complete!");
    console.log(`User ID: ${SWEET_ROOTS_FARM_USER_ID}`);
  } catch (error) {
    console.error("❌ Error setting up Sweet Roots Farm:", error);
    process.exit(1);
  }
};

// Run the setup
createSweetRootsFarmUser();
