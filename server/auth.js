
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "./models/Admin.js";

const router = express.Router();

// ONE-TIME ADMIN SETUP
router.post("/setup", async (req, res) => {
  try {
    const setupSecret = process.env.ADMIN_SETUP_SECRET;
    const providedSecret = req.headers["x-setup-secret"];

    if (!setupSecret || providedSecret !== setupSecret) {
      return res.status(401).json({
        message: "Invalid setup authorization"
      });
    }

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({
        message: "Admin environment variables are missing"
      });
    }

    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return res.status(403).json({
        message: "Admin account already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    );

    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Admin account created successfully"
    });

  } catch (error) {
    console.error("Admin setup error:", error.message);

    res.status(500).json({
      message: "Admin setup failed"
    });
  }
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed"
    });
  }
});

export default router;
