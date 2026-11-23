import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  college: { type: String, default: "" },
  year: { type: String, default: "" },
  description: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Education ||
  mongoose.model("Education", educationSchema);