import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";
import calendarRoute from "./routes/calendar.js";
import usersRoute from "./routes/members.js";
import eventRoute from "./routes/event.js";
import { remainder } from "./utils/remainder.js";

const app = express();
dotenv.config();

// Constants
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("uploads"));

// Routes
// http://localhost:3002
app.use("/api/auth", authRoute);
app.use("/api/calendars", calendarRoute);
app.use("/api/users", usersRoute);
app.use("/api/events", eventRoute);

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.ik4rvox.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    remainder();
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();
