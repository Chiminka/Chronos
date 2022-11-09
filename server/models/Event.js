import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "New event" },
  description: { type: String },
  date_start: { type: Date, required: true },
  date_end: { type: Date, required: true },
  calendars: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Calendar", required: true },
  ],
  type: { type: String, required: true, default: "task" },
});
export default mongoose.model("Event", EventSchema);

// name
// description
// date_start (предназначена на)
// date_end (предназначена до)
// id_calendar (array)
// type (task, remainder, arrangement)
