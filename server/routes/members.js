import { Router } from "express";
import { UserController } from "../controllers/users.js";
import { verifyJWT } from "../utils/checkAuth.js";

const userController = new UserController();

const router = new Router();
router.use(verifyJWT);

// Get my calendars +
// http://localhost:3002/api/users/calendars
router.get("/calendars", userController.getMyCalendars);

// Invite friend
// http://localhost:3002/api/users/ivite
router.post("/invite", userController.inviteFriends);

// Get calendar members +
// http://localhost:3002/api/users/calendars/:id
router.get("/calendars/:id", userController.GetMembers);

// Delete user by id +
// http://localhost:3002/api/users/:id
router.delete("/:id", userController.deleteUser);

// Update user by id +
// http://localhost:3002/api/users/:id
router.patch("/:id", userController.updateUser);

export default router;
