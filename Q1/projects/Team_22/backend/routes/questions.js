const express = require("express");
const router = express.Router();
const { body, query, validationResult } = require("express-validator");
const { Question, Session } = require("../models");

// @desc    Post a new question to a session
// @route   POST /api/questions
// @access  Public
router.post(
  "/",
  [
    body("sessionId").trim().notEmpty().withMessage("Session ID is required"),
    body("studentName")
      .trim()
      .notEmpty()
      .withMessage("Student name is required")
      .isLength({ min: 1, max: 50 })
      .withMessage("Student name must be between 1 and 50 characters"),
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Question content is required")
      .isLength({ min: 5, max: 1000 })
      .withMessage("Question must be between 5 and 1000 characters"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { sessionId, studentName, content } = req.body;

      // Verify session exists and is active
      const session = await Session.findOne({ sessionId }).populate(
        "course",
        "title code"
      );
      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      if (!session.isActive) {
        return res.status(400).json({
          success: false,
          message: "Session is no longer active",
        });
      }

      // Check for duplicate questions from same student
      const duplicateQuestion = await Question.findOne({
        sessionId,
        studentName: studentName.trim(),
        content: content.trim(),
      });

      if (duplicateQuestion) {
        return res.status(400).json({
          success: false,
          message: "You have already posted this exact question",
        });
      }

      const question = await Question.create({
        sessionId,
        session: session._id,
        studentName: studentName.trim(),
        content: content.trim(),
        timestamp: new Date(),
      });

      // Update session question count
      await Session.findByIdAndUpdate(session._id, {
        $inc: { questionCount: 1 },
      });

      // Populate the question with session and course info for response
      await question.populate({
        path: "session",
        populate: {
          path: "course",
          select: "title code",
        },
      });

      res.status(201).json({
        success: true,
        message: "Question posted successfully",
        data: question,
      });
    } catch (error) {
      console.error("Error posting question:", error);
      res.status(500).json({
        success: false,
        message: "Error posting question",
        error: error.message,
      });
    }
  }
);

// @desc    Get all questions for a session
// @route   GET /api/sessions/:sessionId/questions
// @access  Public
router.get(
  "/session/:sessionId",
  [
    query("status")
      .optional()
      .isIn(["all", "answered", "unanswered", "important"])
      .withMessage(
        "Status must be one of: all, answered, unanswered, important"
      ),
    query("student").optional().trim(),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { sessionId } = req.params;
      const { status = "all", student, page = 1, limit = 50 } = req.query;

      // Verify session exists
      const session = await Session.findOne({ sessionId });
      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      let questions;
      let query = { sessionId };

      // Add student filter if specified
      if (student) {
        query.studentName = new RegExp(student, "i");
      }

      // Get questions based on status filter
      if (status === "all") {
        questions = await Question.find(query);
      } else {
        questions = await Question.getByStatus(sessionId, status);
        // Apply student filter if specified
        if (student) {
          questions = questions.filter((q) =>
            q.studentName.toLowerCase().includes(student.toLowerCase())
          );
        }
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = questions.length;

      // Sort by timestamp (newest first)
      questions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      const paginatedQuestions = questions.slice(startIndex, endIndex);

      // Group questions by student for better organization
      const questionsByStudent = {};
      paginatedQuestions.forEach((question) => {
        if (!questionsByStudent[question.studentName]) {
          questionsByStudent[question.studentName] = [];
        }
        questionsByStudent[question.studentName].push(question);
      });

      res.json({
        success: true,
        count: paginatedQuestions.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        data: {
          questions: paginatedQuestions,
          groupedByStudent: questionsByStudent,
          session: {
            sessionId: session.sessionId,
            isActive: session.isActive,
            questionCount: session.questionCount,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching questions",
        error: error.message,
      });
    }
  }
);

// @desc    Update question status (mark as answered/important)
// @route   PUT /api/questions/:id/status
// @access  Public (will be protected for instructors later)
router.put(
  "/:id/status",
  [
    body("action")
      .isIn([
        "toggle_answered",
        "toggle_important",
        "mark_answered",
        "mark_important",
        "unmark_answered",
        "unmark_important",
      ])
      .withMessage("Invalid action specified"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { action } = req.body;
      const question = await Question.findById(req.params.id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      // Verify session is still active for status updates
      const session = await Session.findOne({ sessionId: question.sessionId });
      if (!session || !session.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot update question status - session is not active",
        });
      }

      // Perform the requested action
      switch (action) {
        case "toggle_answered":
          question.isAnswered = !question.isAnswered;
          break;
        case "toggle_important":
          question.isImportant = !question.isImportant;
          break;
        case "mark_answered":
          question.isAnswered = true;
          break;
        case "mark_important":
          question.isImportant = true;
          break;
        case "unmark_answered":
          question.isAnswered = false;
          break;
        case "unmark_important":
          question.isImportant = false;
          break;
      }

      await question.save();

      res.json({
        success: true,
        message: "Question status updated successfully",
        data: question,
      });
    } catch (error) {
      console.error("Error updating question status:", error);
      res.status(500).json({
        success: false,
        message: "Error updating question status",
        error: error.message,
      });
    }
  }
);

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Public (will be protected later)
router.delete("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Update session question count
    const session = await Session.findOne({ sessionId: question.sessionId });
    if (session) {
      await Session.findByIdAndUpdate(session._id, {
        $inc: { questionCount: -1 },
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Question deleted successfully",
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
});

// @desc    Get questions grouped by student for a session
// @route   GET /api/sessions/:sessionId/questions/by-student
// @access  Public
router.get("/session/:sessionId/by-student", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status = "all" } = req.query;

    // Verify session exists
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    let questions;
    if (status === "all") {
      questions = await Question.find({ sessionId }).sort({ timestamp: -1 });
    } else {
      questions = await Question.getByStatus(sessionId, status);
    }

    // Group questions by student
    const groupedQuestions = {};
    const studentStats = {};

    questions.forEach((question) => {
      const studentName = question.studentName;

      if (!groupedQuestions[studentName]) {
        groupedQuestions[studentName] = [];
        studentStats[studentName] = {
          total: 0,
          answered: 0,
          unanswered: 0,
          important: 0,
        };
      }

      groupedQuestions[studentName].push(question);
      studentStats[studentName].total++;

      if (question.isAnswered) studentStats[studentName].answered++;
      else studentStats[studentName].unanswered++;

      if (question.isImportant) studentStats[studentName].important++;
    });

    res.json({
      success: true,
      count: Object.keys(groupedQuestions).length,
      totalQuestions: questions.length,
      data: {
        questionsByStudent: groupedQuestions,
        studentStats,
        session: {
          sessionId: session.sessionId,
          isActive: session.isActive,
          questionCount: session.questionCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching grouped questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching grouped questions",
      error: error.message,
    });
  }
});

module.exports = router;
