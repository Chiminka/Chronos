import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";
import asyncHandler from "express-async-handler";
import { decode } from "punycode";
import Calendar from "../models/Calendar.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Event from "../models/Event.js";

export class CalendarController {
  async createNewCalendar(req, res) {
    try {
      const { name, description, color, members } = req.body;

      // categories = id category
      const id = req.user.id;
      const user = await User.findById(id);
      const userId = user.id;

      const newCalendar = new Calendar({
        name: name,
        description,
        members: members,
        color,
        icon: "https://cdn-icons-png.flaticon.com/512/4206/4206324.png",
        author: userId,
      });

      // если у нас нет никаких календарей в бд, то создается калентарь с типом "основной"
      const calendars = await Calendar.find();
      if (calendars.length < 1) newCalendar.type = "main";
      else if (calendars.length >= 1) newCalendar.type = "additional";
      await newCalendar.save();
      return res.json(newCalendar);
    } catch (error) {
      console.log(error);
      res.json({ message: "Creating calendar error" });
    }
  }
  async updateCalendar(req, res) {
    try {
      const { name, description, color, visible, national_holidays, members } =
        req.body;

      const calendar = await Calendar.findById(req.params.id);

      calendar.name = name;
      calendar.description = description;
      calendar.color = color;
      // если тип клендаря дополнительный, то можно поменять visible
      if (calendar.type === "additional") calendar.visible = visible;
      calendar.national_holidays = national_holidays;
      if (members.length === 0) {
        calendar.members = [];
      } else if (members) calendar.members = members;

      await calendar.save();

      res.json(calendar);
    } catch (error) {
      console.log(error);
      return res.json({ message: "Updating calendar error" });
    }
  }
  async deleteCalendar(req, res) {
    try {
      // Удалить можно только доп календари.
      // При удалении календаря, нужно проверять, есть ли у ивента хоть один календарь, если нет, удалить его.

      const calendar = await Calendar.findOneAndDelete({
        type: "additional",
        _id: req.params.id,
      });
      await Event.updateMany({ $pull: { calendars: req.params.id } });
      if (!calendar)
        return res.json({
          message:
            "That calendar is not exist or you trying to delete a main calendar!",
        });

      await Event.deleteMany({ calendars: [] });
      res.json({ message: "Calendar was deleted" });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Deleting calendar error" });
    }
  }
  async getAllCalendars(req, res) {
    try {
      // получить все календари, где ты участник
      const user = await User.findById(req.user.id);
      const userId = user.id;

      const calendar = await Calendar.find({ members: { _id: userId } });
      res.json(calendar);
    } catch (error) {
      console.log(error);
      return res.json({ message: "Getting calendars error" });
    }
  }
  async getCalendarById(req, res) {
    try {
      const calendar = await Calendar.findById({ _id: req.params.id });
      res.json(calendar);
    } catch (error) {
      console.log(error);
      return res.json({ message: "Getting calendar error" });
    }
  }
  async getCalendarEvents(req, res) {
    try {
      const events = await Event.find({ calendars: { _id: req.params.id } });
      res.json(events);
    } catch (error) {
      res.json({ message: "Getting calendars error" });
    }
  }
}
