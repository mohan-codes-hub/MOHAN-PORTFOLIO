import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  role: { type: String, default: "" },
  about: { type: String, default: "" },
  photo: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);