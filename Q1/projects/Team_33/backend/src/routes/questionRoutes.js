const express = require("express");
const { createQuestion, getQuestions, updateQuestionStatus } = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/", protect, createQuestion);
router.get("/:classId", protect, getQuestions);
router.patch("/:id/status", protect, updateQuestionStatus);

module.exports = router;
