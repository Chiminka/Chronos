import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";
import asyncHandler from "express-async-handler";
import { decode } from "punycode";

export class EventController {
  async getEventById(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Getting calendars error" });
    }
  }
  async getAllEvents(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Getting calendars error" });
    }
  }
  async createEvent(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Creating calendars error" });
    }
  }
  async deleteEvent(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Deleting calendars error" });
    }
  }
  async updateEvent(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Updating calendars error" });
    }
  }
}
