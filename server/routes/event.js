import { Router } from "express";
import { EventController } from "../controllers/events.js";
import { verifyJWT } from "../utils/checkAuth.js";

const eventController = new EventController();

const router = new Router();
router.use(verifyJWT);

// Get event by id
// http://localhost:3002/api/auth/events/:id
router.get("/:id", eventController.getEventById);

// Get all events
// http://localhost:3002/api/auth/events
router.get("/", eventController.getAllEvents);

// Create new event
// http://localhost:3002/api/auth/events
router.post("/", eventController.createEvent);

// Delete event by id
// http://localhost:3002/api/auth/events/:id
router.delete("/:id", eventController.deleteEvent);

// Update event by id
// http://localhost:3002/api/auth/events/:id
router.patch("/:id", eventController.updateEvent);

export default router;
