import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailTransport from "../utils/mailTransport.js";
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
      const { email, id_calendar } = req.body;

      const new_member = await User.findOne({ email: email });
      if (!new_member)
        return res.json({
          success: false,
          message: "Sorry, user not founded!",
        });

      // verification email
      const url = `${process.env.BASE_URL}calendars/${id_calendar}`;
      mailTransport().sendMail({
        from: process.env.USER,
        to: email,
        subject: `Tou have been invited to the calendar by ${req.user.username}. To grant access, follow the link or ignore this message.`,
        html: `<h1>${url}</h1>`,
      });
      ////////////////////////////////////////
      res.json({
        message: "An Email was sent to your friend",
      });
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
      const user = await User.findById(req.params.id);
      // console.log(req.user._id, user._id);
      if (req.user._id.equals(user._id)) {
        await User.findByIdAndDelete(req.params.id);
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); //No content
        res.clearCookie("jwt", {
          httpOnly: true,
        });
        res.clearCookie("accessToken", {
          httpOnly: true,
        });
        res.json({ message: "Cookie were cleared, user was deleted" });
      } else return res.json({ message: "No access!" });
    } catch (error) {
      console.log(error);
      res.json({ message: "Deleting user error" });
    }
  }
  async updateUser(req, res) {
    try {
      const { full_name, username, password, email } = req.body;
      const user = await User.findById(req.params.id);
      if (req.user._id.equals(user._id)) {
        user.full_name = full_name;
        if (username) {
          user.username = username;
          if (!username.match(/^[a-zA-Z0-9._]*$/)) {
            return res.json({
              message: "Username isn't valid",
            });
          }
        }
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
      } else return res.json({ message: "No access!" });
    } catch (error) {
      console.log(error);
      res.json({ message: "Updating user error" });
    }
  }
}
