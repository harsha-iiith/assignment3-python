import express from "express";
import {
  createClassroom,
  joinClassroom,
  getMyClasses,
} from "../controllers/classroomController.js";
import { protect, teacher } from "../middleware/authMiddleware.js";
const router = express.Router();
router.route("/").get(protect, getMyClasses);
router.route("/create").post(protect, teacher, createClassroom);
router.route("/join").post(protect, joinClassroom);
export default router;
