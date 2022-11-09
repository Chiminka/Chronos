import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true, default: "" },
  email: { type: String, required: true, default: "" },
  password: { type: String, required: true, default: "" },
  verified: { type: Boolean, required: true, default: "false" },
});
export default mongoose.model("User", UserSchema);

// email
// full_name
// password
// verified
