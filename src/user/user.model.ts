import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  created_at: { type: Date },
  updated_at: { type: Date },
});

export default mongoose.model("User", UserSchema);
