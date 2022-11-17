import { Router } from "express";
import { CalendarController } from "../controllers/calendars.js";
import { verifyJWT } from "../utils/checkAuth.js";

const calendarController = new CalendarController();

const router = new Router();
router.use(verifyJWT);

// Get calendar events +
// http://localhost:3002/api/calendars/:id/events
router.get("/:id/events", calendarController.getCalendarEvents);

// Create calendar +
// http://localhost:3002/api/calendars
router.post("/", calendarController.createNewCalendar);

// Get all calendars +
// http://localhost:3002/api/calendars
router.get("/", calendarController.getAllCalendars);

// Get calendar by id +
// http://localhost:3002/api/calendars/:id
router.get("/:id", calendarController.getCalendarById);

// Update calendar by id +
// http://localhost:3002/api/calendars/:id
router.patch("/:id", calendarController.updateCalendar);

// Delete calendar by id +
// http://localhost:3002/api/calendars/:id
router.delete("/:id", calendarController.deleteCalendar);

export default router;
