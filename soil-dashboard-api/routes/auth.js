const express = require("express");
const { pool } = require("../database");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// POST /api/auth/login - Handle social login
router.post("/login", async (req, res) => {
  try {
    const { email, name, provider, providerId, avatarUrl } = req.body;

    // Validation
    if (!email || !name || !provider || !providerId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: email, name, provider, providerId",
      });
    }

    // Check if user already exists
    let result = await pool.query(
      "SELECT * FROM users WHERE provider = $1 AND provider_id = $2",
      [provider, providerId]
    );

    let user;

    if (result.rows.length === 0) {
      // Create new user
      result = await pool.query(
        `INSERT INTO users (email, name, provider, provider_id, avatar_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [email, name, provider, providerId, avatarUrl || null]
      );
      user = result.rows[0];
    } else {
      // Update existing user
      result = await pool.query(
        `UPDATE users 
         SET email = $1, name = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP
         WHERE provider = $4 AND provider_id = $5
         RETURNING *`,
        [email, name, avatarUrl || null, provider, providerId]
      );
      user = result.rows[0];
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          avatarUrl: user.avatar_url,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      error: "Failed to authenticate user",
    });
  }
});

// GET /api/auth/user/:id - Get user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, email, name, provider, avatar_url, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
});

// GET /api/auth/user/provider/:provider/:providerId - Get user by provider and provider ID
router.get("/user/provider/:provider/:providerId", async (req, res) => {
  try {
    const { provider, providerId } = req.params;

    const result = await pool.query(
      "SELECT id, email, name, provider, avatar_url, created_at FROM users WHERE provider = $1 AND provider_id = $2",
      [provider, providerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
});

module.exports = router;
