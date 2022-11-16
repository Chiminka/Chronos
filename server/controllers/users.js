import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";
import asyncHandler from "express-async-handler";
import { decode } from "punycode";

export class UserController {
  async getMyCalendars(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Getting user error" });
    }
  }
  async inviteFriends(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Inviting error" });
    }
  }
  async GetMembers(req, res) {
    try {
    } catch (error) {
      res.json({ message: "Getting members error" });
    }
  }
}
