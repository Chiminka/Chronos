import Event from "../models/Event.js";
import User from "../models/User.js";
import schedule from "node-schedule";
import mailTransport from "../utils/mailTransport.js";

export const remainder = async () => {
  let date_remaind = "";
  schedule.scheduleJob("*/1 * * * 0-6", async () => {
    const event = await Event.find();
    const date = new Date();
    for (let i = 0; i < event.length; i++) {
      if (event[i].remind === "at_start_time") {
        date_remaind = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getUTCHours(),
          date.getMinutes(),
        ].join("-");
        if (
          [
            event[i].date_start.getFullYear(),
            event[i].date_start.getMonth() + 1,
            event[i].date_start.getDate(),
            event[i].date_start.getUTCHours(),
            event[i].date_start.getMinutes(),
          ].join("-") === date_remaind
        ) {
          const user = await User.findById(event[i].author);
          mailTransport().sendMail({
            from: process.env.USER,
            to: user.email,
            subject: `Reminder: event ${event[i].name} just started`,
            html: `<h1>Your event ${event[i].name} just started</h1>`,
          });
          event[i].remind = "false";
          await event[i].save();
        }
      } else if (event[i].remind === "day_before") {
        date_remaind = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate() + 1,
        ].join("-");
        // console.log(date_remaind);
        if (
          [
            event[i].date_start.getFullYear(),
            event[i].date_start.getMonth() + 1,
            event[i].date_start.getDate(),
          ].join("-") === date_remaind
        ) {
          const user = await User.findById(event[i].author);
          mailTransport().sendMail({
            from: process.env.USER,
            to: user.email,
            subject: `Reminder: event ${event[i].name} starts tomorrow`,
            html: `<h1>Your event ${event[i].name} starts tomorrow</h1>`,
          });
          event[i].remind = "false";
          await event[i].save();
        }
      } else if (event[i].remind === "hour_before") {
        date_remaind = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getUTCHours() - 1,
        ].join("-");

        // 6 5 - 5 4
        // 6 5 - 4 3

        if (
          [
            event[i].date_start.getFullYear(),
            event[i].date_start.getMonth() + 1,
            event[i].date_start.getDate(),
            event[i].date_start.getUTCHours(),
          ].join("-") === date_remaind
        ) {
          const user = await User.findById(event[i].author);
          mailTransport().sendMail({
            from: process.env.USER,
            to: user.email,
            subject: `Reminder: event ${event[i].name} starts in one hour`,
            html: `<h1>Your event ${event[i].name} starts in one hour</h1>`,
          });
          event[i].remind = "false";
          await event[i].save();
        }
      } else if (event[i].remind === "5_minutes_before") {
        date_remaind = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getUTCHours(),
          date.getMinutes() + 5,
        ].join("-");

        if (
          [
            event[i].date_start.getFullYear(),
            event[i].date_start.getMonth() + 1,
            event[i].date_start.getDate(),
            event[i].date_start.getUTCHours(),
            event[i].date_start.getMinutes(),
          ].join("-") === date_remaind
        ) {
          const user = await User.findById(event[i].author);
          mailTransport().sendMail({
            from: process.env.USER,
            to: user.email,
            subject: `Reminder: event ${event[i].name} starts in 5 minutes`,
            html: `<h1>Your event ${event[i].name} starts in 5 minutes</h1>`,
          });
          event[i].remind = "false";
          await event[i].save();
        }
      }
    }
  });
};
