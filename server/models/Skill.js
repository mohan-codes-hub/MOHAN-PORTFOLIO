import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Skill ||
  mongoose.model("Skill", skillSchema);