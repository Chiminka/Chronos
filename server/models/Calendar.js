import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "New calendar" },
  description: { type: String, default: "" },
  type: { type: String, required: true, default: "additionally" },
  color_event: { type: String, required: true, default: "fffff" },
  icon: { type: String, required: true, default: "" },
  visible: { type: Boolean, required: true, default: "true" },
  national_holidays: { type: Boolean, required: true, default: "true" },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
export default mongoose.model("Calendar", CalendarSchema);

// name
// description
// type (дополнительный или основной)
// color_event
// icon
// visible
