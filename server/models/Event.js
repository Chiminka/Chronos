import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "New event",
  },
  description: {
    type: String,
  },
  date_start: {
    type: Date,
    required: true,
  },
  date_end: {
    type: Date,
    required: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  calendars: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Calendar",
      required: true,
    },
  ],
  repeat: {
    type: String,
    required: false,
  },
  remind: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
    default: "task",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
export default mongoose.model("Event", EventSchema);

// name
// description
// date_start (предназначена на)
// date_end (предназначена до)
// id_calendar (array)
// type (task, remainder, arrangement)
