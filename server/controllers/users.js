import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";
import asyncHandler from "express-async-handler";
import { decode } from "punycode";
import Calendar from "../models/Calendar.js";

export class UserController {
  async getMyCalendars(req, res) {
    try {
      // получить все календари, где ты автор
      const user = await User.findById(req.user.id);
      const userId = user.id;

      const calendar = await Calendar.find({ author: { _id: userId } });
      res.json(calendar);
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
      const calendar = await Calendar.findById({ _id: req.params.id });
      const user = [];
      for (let i = 0; i < calendar.members.length; i++) {
        user[i] = await User.findById({ _id: calendar.members[i] });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.json({ message: "Getting members error" });
    }
  }
  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User was deleted" });
    } catch (error) {
      res.json({ message: "Deleting user error" });
    }
  }
  async updateUser(req, res) {
    try {
      const { full_name, username, password, email } = req.body;
      const user = await User.findById(req.params.id);

      user.full_name = full_name;
      if (username) user.username = username;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.password = hash;
      }
      if (email) {
        var validRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!email.match(validRegex)) {
          return res.json({
            message: "Email isn't valid",
          });
        }
        user.email = email;
        user.verified = false;
        const v_token = jwt.sign(
          {
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );

        // verification email
        const url = `${process.env.BASE_URL}verify/${v_token}`;
        mailTransport().sendMail({
          from: process.env.USER,
          to: user.email,
          subject: "Verify your email account",
          html: `<h1>${url}</h1>`,
        });
        await user.save();
        return res.json({
          user,
          message: "An Email sent to your account please verify",
        });
      }
      await user.save();
      res.json(user);
    } catch (error) {
      console.log(error);
      res.json({ message: "Updating user error" });
    }
  }
}
