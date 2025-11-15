import { Router } from "express";
import {
  registerTeacher,
  createClass,
  loginTeacher,
  logoutTeacher,
  getAllCreatedEvents,
  answerQuery,
  getAllClassQueries,
  impQuery,
  getTeacherClasses,
  endClass,
  deleteQuery
} from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerTeacher);
router.route("/login").post(loginTeacher);

// secured routes
router.route("/logout").post(verifyJWT,logoutTeacher);
router.route("/createClass").post(verifyJWT, createClass);
router.route("/getAllCreatedEvents").get(verifyJWT, getAllCreatedEvents);
router.route("/answerQuery").post(verifyJWT, answerQuery);
router.route("/impQuery").post(verifyJWT, impQuery);
router.route("/getAllClassQueries").get(verifyJWT, getAllClassQueries);
router.route("/getTeacherClasses").get(verifyJWT, getTeacherClasses);
router.route("/endClass").post(verifyJWT, endClass);
router.route("/deleteQuery/:queryId").delete(verifyJWT,deleteQuery)
export default router;
