import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "New calendar",
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: false,
    default: "additionally",
  },
  color: {
    type: String,
    required: false,
    default: "#c4def6",
  },
  visible: {
    type: Boolean,
    required: false,
    default: "true",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
export default mongoose.model("Calendar", CalendarSchema);

// name
// description
// type (дополнительный или основной)
// color_event
// icon
// visible
