import Event from "../models/Event.js";
import Calendar from "../models/Calendar.js";

export class EventController {
  async getEventById(req, res) {
    try {
      const event = await Event.findById({ _id: req.params.id });
      res.json(event);
    } catch (error) {
      res.json({ message: "Getting event error" });
    }
  }
  async getAllEvents(req, res) {
    try {
      const event = await Event.find({ author: { _id: req.user.id } }).sort(
        "-date_start"
      );
      res.json(event);
    } catch (error) {
      res.json({ message: "Getting events error" });
    }
  }
  async createEvent(req, res) {
    try {
      let {
        remind,
        name,
        description,
        date_start,
        date_end,
        calendars,
        type,
        completed,
        repeat,
      } = req.body;

      if (!calendars || !date_start)
        return res.json({ message: "Content can not be empty" });

      if (date_start) {
        const date_s = new Date(`${date_start}T00:00:00`);
        date_start = !date_start.includes("T")
          ? (date_start = date_s)
          : (date_start = date_start);
      }
      if (date_end) {
        const date_e = new Date(`${date_end}T00:00:00`);
        date_end = !date_end.includes("T")
          ? (date_end = date_e)
          : (date_end = date_end);
      }

      // console.log(date_start, date_end);

      if (type !== "reminder" || type !== "event") remind = "";
      const newEvent = new Event({
        remind: remind,
        name: name,
        description,
        calendars: calendars,
        type,
        author: req.user.id,
        completed,
        date_start,
        date_end,
        repeat,
      });

      await newEvent.save();
      return res.json(newEvent);
    } catch (error) {
      console.log(error);
      res.json({ message: "Creating event error" });
    }
  }
  async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      // console.log(event.calendars[0]);

      for (let i = 0; i < event.calendars.length; i++) {
        const member = await Calendar.find({
          _id: event.calendars[i],
          members: req.user._id,
        });
        if (req.user._id.equals(event.author) || member.length > 0) {
          await Event.findByIdAndDelete(req.params.id);
          return res.json({ message: "Event was deleted" });
        } else return res.json({ message: "No access!" });
      }
    } catch (error) {
      res.json({ message: "Deleting event error" });
    }
  }
  async updateEvent(req, res) {
    try {
      let {
        remind,
        calendars,
        repeat,
        name,
        description,
        date_start,
        date_end,
        type,
        completed,
      } = req.body;

      if (date_start) {
        const date_s = new Date(`${date_start}T00:00:00`);
        date_start = !date_start.includes("T")
          ? (date_start = date_s)
          : (date_start = date_start);
      }
      if (date_end) {
        const date_e = new Date(`${date_end}T00:00:00`);
        date_end = !date_end.includes("T")
          ? (date_end = date_e)
          : (date_end = date_end);
      }

      const event = await Event.findById(req.params.id);

      for (let i = 0; i < event.calendars.length; i++) {
        const member = await Calendar.find({
          _id: event.calendars[i],
          members: req.user._id,
        });
        if (req.user._id.equals(event.author) || member.length > 0) {
          if (remind) event.remind = remind;
          if (name) event.name = name;
          if (description) event.description = description;
          if (date_start) event.date_start = date_start;
          if (date_end) event.date_end = date_end;
          if (type) event.type = type;
          if (completed) event.completed = completed;
          if (repeat) event.repeat = repeat;
          if (calendars) event.calendars = calendars;
          await event.save();

          return res.json(event);
        } else return res.json({ message: "No access!" });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "Updating event error" });
    }
  }
}
