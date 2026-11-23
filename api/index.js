
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "../server/db.js";

import Profile from "../server/models/Profile.js";
import Skill from "../server/models/Skill.js";
import Education from "../server/models/Education.js";
import Project from "../server/models/Project.js";
import Message from "../server/models/Message.js";

import authRoutes from "../server/auth.js";
import adminRoutes from "../server/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Database connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// API Status
app.get("/api", (req, res) => {
  res.json({
    message: "Mohan Portfolio API is running"
  });
});

// Public Profile
app.get("/api/profile", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({
      message: "Failed to load profile"
    });
  }
});

// Public Skills
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load skills"
    });
  }
});

// Public Education
app.get("/api/education", async (req, res) => {
  try {
    const education = await Education.find();
    res.json(education);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load education"
    });
  }
});

// Public Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load projects"
    });
  }
});

// Contact Form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required"
      });
    }

    await Message.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      message: "Message sent successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message"
    });
  }
});

// Start Backend Server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export default app;
