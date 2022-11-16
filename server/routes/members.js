import { Router } from "express";
import { UserController } from "../controllers/users.js";
import { verifyJWT } from "../utils/checkAuth.js";

const userController = new UserController();

const router = new Router();
router.use(verifyJWT);

// Get my calendars
// http://localhost:3002/api/auth/users/calendars
router.post("/calendars", userController.getMyCalendars);

// Invite friend
// http://localhost:3002/api/auth/users/ivite
router.post("/invite", userController.inviteFriends);

// Get calendar members
// http://localhost:3002/api/auth/users
router.get("/", userController.GetMembers);

export default router;
