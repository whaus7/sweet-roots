const express = require("express");
const { pool } = require("../database");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// GET /api/brix/readings - Get all Brix readings for a user
router.get("/readings", async (req, res) => {
  try {
    const { plant_name, limit = 100, offset = 0, user_id } = req.query;

    let query = `
      SELECT 
        id, 
        user_id,
        plant_name, 
        brix_value, 
        reading_date, 
        notes, 
        created_at, 
        updated_at
      FROM brix_readings
    `;

    const params = [];
    let whereConditions = [];

    if (user_id) {
      whereConditions.push(`user_id = $${params.length + 1}`);
      params.push(user_id);
    }

    if (plant_name) {
      whereConditions.push(`plant_name = $${params.length + 1}`);
      params.push(plant_name);
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    query +=
      " ORDER BY reading_date DESC, created_at DESC LIMIT $" +
      (params.length + 1) +
      " OFFSET $" +
      (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching Brix readings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch Brix readings",
    });
  }
});

// GET /api/brix/readings/:id - Get a specific Brix reading
router.get("/readings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM brix_readings WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Brix reading not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching Brix reading:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch Brix reading",
    });
  }
});

// POST /api/brix/readings - Create a new Brix reading
router.post("/readings", async (req, res) => {
  try {
    const { plant_name, brix_value, reading_date, notes, user_id } = req.body;

    // Validation
    if (!plant_name || !brix_value || !reading_date || !user_id) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: plant_name, brix_value, reading_date, user_id",
      });
    }

    if (brix_value < 0 || brix_value > 30) {
      return res.status(400).json({
        success: false,
        error: "Brix value must be between 0 and 30",
      });
    }

    // Verify user exists
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
      user_id,
    ]);

    if (userCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO brix_readings (user_id, plant_name, brix_value, reading_date, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, plant_name, brix_value, reading_date, notes || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating Brix reading:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create Brix reading",
    });
  }
});

// PUT /api/brix/readings/:id - Update a Brix reading
router.put("/readings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { plant_name, brix_value, reading_date, notes } = req.body;

    // Check if reading exists
    const existing = await pool.query(
      "SELECT * FROM brix_readings WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Brix reading not found",
      });
    }

    // Validation
    if (brix_value !== undefined && (brix_value < 0 || brix_value > 30)) {
      return res.status(400).json({
        success: false,
        error: "Brix value must be between 0 and 30",
      });
    }

    const result = await pool.query(
      `UPDATE brix_readings 
       SET plant_name = COALESCE($1, plant_name),
           brix_value = COALESCE($2, brix_value),
           reading_date = COALESCE($3, reading_date),
           notes = COALESCE($4, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [plant_name, brix_value, reading_date, notes, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating Brix reading:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update Brix reading",
    });
  }
});

// DELETE /api/brix/readings/:id - Delete a Brix reading
router.delete("/readings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM brix_readings WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Brix reading not found",
      });
    }

    res.json({
      success: true,
      message: "Brix reading deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Brix reading:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete Brix reading",
    });
  }
});

// GET /api/brix/plants - Get all available plants
router.get("/plants", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM plant_reference ORDER BY category, plant_name"
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch plants",
    });
  }
});

// GET /api/brix/plants/:name - Get a specific plant
router.get("/plants/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const result = await pool.query(
      "SELECT * FROM plant_reference WHERE plant_name = $1",
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Plant not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching plant:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch plant",
    });
  }
});

// GET /api/brix/stats - Get statistics
router.get("/stats", async (req, res) => {
  try {
    const { plant_name, user_id } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_readings,
        AVG(brix_value) as average_brix,
        MIN(brix_value) as min_brix,
        MAX(brix_value) as max_brix,
        COUNT(DISTINCT plant_name) as unique_plants
      FROM brix_readings
    `;

    const params = [];
    let whereConditions = [];

    if (user_id) {
      whereConditions.push(`user_id = $${params.length + 1}`);
      params.push(user_id);
    }

    if (plant_name) {
      whereConditions.push(`plant_name = $${params.length + 1}`);
      params.push(plant_name);
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
});

module.exports = router;
