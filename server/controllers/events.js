import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";
import asyncHandler from "express-async-handler";
import { decode } from "punycode";
import Calendar from "../models/Calendar.js";
import Event from "../models/Event.js";

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
      const event = await Event.find({ author: { _id: req.user.id } });
      res.json(event);
    } catch (error) {
      res.json({ message: "Getting events error" });
    }
  }
  async createEvent(req, res) {
    try {
      const {
        name,
        description,
        date_start,
        date_end,
        calendars,
        type,
        completed,
      } = req.body;

      if (!calendars || !date_start || !date_end)
        return res.json({ message: "Content can not be empty" });

      // categories = id category

      const newEvent = new Event({
        name: name,
        description,
        calendars: calendars,
        type,
        author: req.user.id,
        completed,
        date_start,
        date_end,
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
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event was deleted" });
    } catch (error) {
      res.json({ message: "Deleting event error" });
    }
  }
  async updateEvent(req, res) {
    try {
      const { name, description, date_start, date_end, type, completed } =
        req.body;

      const event = await Event.findById(req.params.id);

      event.name = name;
      event.description = description;
      if (date_start) event.date_start = date_start;
      if (date_end) event.date_end = date_end;
      event.type = type;
      event.completed = completed;
      await event.save();

      res.json(event);
    } catch (error) {
      res.json({ message: "Updating event error" });
    }
  }
}
