import User from "../models/User.js";
import Calendar from "../models/Calendar.js";
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
        author: userId,
      });

      // если у нас нет никаких календарей в бд, то создается калентарь с типом "основной"
      const calendars = await Calendar.findOne({ author: userId });
      if (!calendars) newCalendar.type = "main";
      else newCalendar.type = "additional";
      await newCalendar.save();
      return res.json(newCalendar);
    } catch (error) {
      console.log(error);
      res.json({ message: "Creating calendar error" });
    }
  }
  async updateCalendar(req, res) {
    try {
      const { name, description, color, visible, members } = req.body;

      const calendar = await Calendar.findById(req.params.id);
      const member = await Calendar.find({ members: req.user._id });

      if (req.user._id.equals(calendar.author) || member.length > 0) {
        if (name) calendar.name = name;
        calendar.description = description;
        if (color) calendar.color = color;
        // если тип клендаря дополнительный, то можно поменять visible
        if (calendar.type === "additional") calendar.visible = visible;
        if (calendar.members.length === 0) {
          calendar.members = [];
        } else if (members) calendar.members = members;

        await calendar.save();

        res.json(calendar);
      } else return res.json({ message: "No access!" });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Updating calendar error" });
    }
  }
  async deleteCalendar(req, res) {
    try {
      // Удалить можно только доп календари.
      // При удалении календаря, нужно проверять, есть ли у ивента хоть один календарь, если нет, удалить его.
      const calendar = await Calendar.findOne({
        type: "additional",
        _id: req.params.id,
      });
      const member = await Calendar.find({ members: req.user._id });
      if (req.user._id.equals(calendar.author) || member.length > 0) {
        const calendar = await Calendar.findOneAndDelete({
          type: "additional",
          _id: req.params.id,
        });
        if (!calendar)
          return res.json({
            message:
              "That calendar is not exist or you trying to delete a main calendar!",
          });
        await Event.updateMany({ $pull: { calendars: req.params.id } });
        await Event.deleteMany({ calendars: [] });
        res.json({ message: "Calendar was deleted" });
      } else return res.json({ message: "No access!" });
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
      const user = await User.findById(req.user.id);
      const calendar = await Calendar.findById({ _id: req.params.id });
      const new_user = await Calendar.findOne({ members: { _id: user._id } });
      if (!new_user) {
        calendar.members.push(user);
      }
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
