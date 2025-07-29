const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();

    // Create brix_readings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS brix_readings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        plant_name VARCHAR(100) NOT NULL,
        brix_value DECIMAL(4,1) NOT NULL CHECK (brix_value >= 0 AND brix_value <= 30),
        reading_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create plant_reference table for healthy Brix ranges
    await client.query(`
      CREATE TABLE IF NOT EXISTS plant_reference (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        plant_name VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(50) NOT NULL,
        healthy_brix_min DECIMAL(4,1) NOT NULL,
        healthy_brix_max DECIMAL(4,1) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default plant data if table is empty
    const plantCount = await client.query(
      "SELECT COUNT(*) FROM plant_reference"
    );
    if (parseInt(plantCount.rows[0].count) === 0) {
      const defaultPlants = [
        // Leafy Greens
        ["Spinach", "Leafy Greens", 6, 12, "High in iron and nutrients"],
        ["Kale", "Leafy Greens", 8, 14, "Nutrient-dense superfood"],
        ["Lettuce", "Leafy Greens", 4, 8, "Mild and crisp"],
        ["Arugula", "Leafy Greens", 6, 10, "Peppery and nutritious"],
        ["Swiss Chard", "Leafy Greens", 6, 12, "Colorful and vitamin-rich"],
        ["Collard Greens", "Leafy Greens", 8, 14, "Southern staple green"],

        // Brassicas
        ["Broccoli", "Brassicas", 8, 14, "Cancer-fighting cruciferous"],
        ["Cauliflower", "Brassicas", 6, 12, "Versatile white vegetable"],
        ["Cabbage", "Brassicas", 6, 10, "Sturdy storage vegetable"],
        ["Brussels Sprouts", "Brassicas", 8, 14, "Miniature cabbages"],

        // Root Vegetables
        ["Carrots", "Root Vegetables", 8, 16, "Sweet orange roots"],
        ["Beets", "Root Vegetables", 10, 18, "Sweet and colorful"],
        ["Radishes", "Root Vegetables", 6, 12, "Peppery and crisp"],
        ["Turnips", "Root Vegetables", 6, 12, "Mild root vegetable"],
        ["Parsnips", "Root Vegetables", 8, 14, "Sweet winter root"],

        // Nightshades
        ["Tomatoes", "Nightshades", 8, 16, "Sweet garden favorite"],
        ["Bell Peppers", "Nightshades", 6, 12, "Colorful and sweet"],
        ["Eggplant", "Nightshades", 4, 8, "Meaty purple vegetable"],
        ["Potatoes", "Nightshades", 6, 12, "Starchy staple crop"],

        // Legumes
        ["Green Beans", "Legumes", 6, 10, "Crisp garden beans"],
        ["Peas", "Legumes", 8, 14, "Sweet garden peas"],
        ["Snap Peas", "Legumes", 8, 14, "Edible pod peas"],

        // Alliums
        ["Onions", "Alliums", 6, 12, "Essential cooking ingredient"],
        ["Garlic", "Alliums", 8, 14, "Pungent flavor enhancer"],
        ["Leeks", "Alliums", 6, 12, "Mild onion relative"],

        // Cucurbits
        ["Cucumbers", "Cucurbits", 4, 8, "Cool and refreshing"],
        ["Zucchini", "Cucurbits", 4, 8, "Versatile summer squash"],
        ["Winter Squash", "Cucurbits", 8, 16, "Sweet storage squash"],
        ["Pumpkins", "Cucurbits", 8, 16, "Autumn harvest favorite"],

        // Herbs
        ["Basil", "Herbs", 6, 12, "Aromatic Italian herb"],
        ["Parsley", "Herbs", 6, 10, "Fresh garnish herb"],
        ["Cilantro", "Herbs", 6, 10, "Fresh Mexican herb"],
        ["Mint", "Herbs", 6, 12, "Cooling aromatic herb"],

        // Microgreens
        [
          "Sunflower Microgreens",
          "Microgreens",
          8,
          16,
          "Nutrient-dense sprouts",
        ],
        ["Pea Shoots", "Microgreens", 8, 14, "Sweet pea sprouts"],
        ["Radish Microgreens", "Microgreens", 6, 12, "Spicy microgreens"],
        [
          "Broccoli Microgreens",
          "Microgreens",
          8,
          14,
          "Nutrient-packed sprouts",
        ],
      ];

      for (const plant of defaultPlants) {
        await client.query(
          "INSERT INTO plant_reference (plant_name, category, healthy_brix_min, healthy_brix_max, description) VALUES ($1, $2, $3, $4, $5)",
          plant
        );
      }
    }

    client.release();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
