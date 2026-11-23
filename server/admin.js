
import express from "express";
import protect from "./protect.js";

import Profile from "./models/Profile.js";
import Skill from "./models/Skill.js";
import Education from "./models/Education.js";
import Project from "./models/Project.js";
import Message from "./models/Message.js";

const router = express.Router();

router.use(protect);

// PROFILE
router.get("/profile", async (req, res) => {
  try {
    res.json(await Profile.findOne() || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const allowed = [
      "name", "role", "about", "photo",
      "email", "phone", "location"
    ];

    const data = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });

    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// SKILLS
router.get("/skills", async (req, res) => {
  try {
    res.json(await Skill.find());
  } catch (error) {
    res.status(500).json({ message: "Failed to load skills" });
  }
});

router.post("/skills", async (req, res) => {
  try {
    res.status(201).json(await Skill.create(req.body));
  } catch (error) {
    res.status(400).json({ message: "Failed to add skill" });
  }
});

router.put("/skills/:id", async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) return res.status(404).json({ message: "Skill not found" });

    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: "Failed to update skill" });
  }
});

router.delete("/skills/:id", async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill" });
  }
});

// EDUCATION
router.get("/education", async (req, res) => {
  try {
    res.json(await Education.find());
  } catch (error) {
    res.status(500).json({ message: "Failed to load education" });
  }
});

router.post("/education", async (req, res) => {
  try {
    res.status(201).json(await Education.create(req.body));
  } catch (error) {
    res.status(400).json({ message: "Failed to add education" });
  }
});

router.put("/education/:id", async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) return res.status(404).json({ message: "Education not found" });

    res.json(education);
  } catch (error) {
    res.status(400).json({ message: "Failed to update education" });
  }
});

router.delete("/education/:id", async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) return res.status(404).json({ message: "Education not found" });
    res.json({ message: "Education deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete education" });
  }
});

// PROJECTS
router.get("/projects", async (req, res) => {
  try {
    res.json(await Project.find());
  } catch (error) {
    res.status(500).json({ message: "Failed to load projects" });
  }
});

router.post("/projects", async (req, res) => {
  try {
    res.status(201).json(await Project.create(req.body));
  } catch (error) {
    res.status(400).json({ message: "Failed to add project" });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Failed to update project" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

// CONTACT MESSAGES
router.get("/messages", async (req, res) => {
  try {
    res.json(await Message.find().sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

export default router;
