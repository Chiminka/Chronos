import Calendar from "../models/Calendar.js";

export const createMainCalendar = async (user) => {
  try {
    const calendars = await Calendar.find({ author: user.id });
    if (calendars.length < 1) {
      const newCalendar = new Calendar({
        name: "Main Calendar",
        members: user.id,
        author: user.id,
        type: "main",
      });
      await newCalendar.save();
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Creating calendar error" });
  }
};
