import express from "express";
import { getAllCourses,getAllLectures, createLectureForCourse, deleteLectureFromCourse, getCoursesById,getQuestionForLecture,createQuestion,updateQuestion,deleteQuestion, pinnedQuestion } from "../controllers/courseController.js"; 
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/courses/:userId",protect, getCoursesById);
router.get("/:courseId/lectures", protect, getAllLectures);
router.post("/:courseId/lectures", protect, createLectureForCourse);
router.delete("/:courseId/lectures/:lectureId", protect, deleteLectureFromCourse);


router.get('/getQues/:lectureId',protect,getQuestionForLecture)

router.post('/getQues/:lectureId',protect,createQuestion)

router.post('/updateQues/:quesId',protect,updateQuestion)

router.post('/deleteQues/:quesId',protect,deleteQuestion)

router.post('/pinnedQues/:quesId',protect,pinnedQuestion)
export default router;
