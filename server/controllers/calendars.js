import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";
import asyncHandler from "express-async-handler";
import { decode } from "punycode";

export class CalendarController {
  async createNewCalendar(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Creating calendar error" });
    }
  }
  async updateCalendar(req, res) {
    try {
    } catch (error) {
      console.log(error);
      return res.json({ message: "Updating calendar error" });
    }
  }
  async deleteCalendar(req, res) {
    try {
    } catch (error) {
      console.log(error);
      return res.json({ message: "Deleting calendar error" });
    }
  }
  async getAllCalendars(req, res) {
    try {
    } catch (error) {
      console.log(error);
      return res.json({ message: "Getting calendars error" });
    }
  }
  async getCalendarById(req, res) {
    try {
    } catch (error) {
      console.log(error);
      return res.json({ message: "Getting calendar error" });
    }
  }
  async getMyCalendars(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Getting calendars error" });
    }
  }
  async getCalendarEvents(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Getting calendars error" });
    }
  }
}
