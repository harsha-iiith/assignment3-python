const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Session, Course } = require("../models");
const { generateSessionId } = require("../utils/sessionGenerator");

// @desc    Create new session for a course
// @route   POST /api/sessions
// @access  Public (will be protected later)
router.post(
  "/",
  [
    body("courseId")
      .notEmpty()
      .withMessage("Course ID is required")
      .isMongoId()
      .withMessage("Invalid course ID"),
    body("instructor")
      .trim()
      .notEmpty()
      .withMessage("Instructor name is required")
      .isLength({ max: 50 })
      .withMessage("Instructor name cannot exceed 50 characters"),
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

      const { courseId, instructor } = req.body;

      // Verify course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Check if there's already an active session for this course
      const activeSession = await Session.findOne({
        course: courseId,
        isActive: true,
      });

      if (activeSession) {
        return res.status(400).json({
          success: false,
          message: "An active session already exists for this course",
          data: {
            sessionId: activeSession.sessionId,
            startTime: activeSession.startTime,
          },
        });
      }

      // Generate unique session ID
      const sessionId = generateSessionId();

      const session = await Session.create({
        sessionId,
        course: courseId,
        instructor,
        isActive: true,
        startTime: new Date(),
      });

      // Populate course information in response
      await session.populate("course", "title code");

      res.status(201).json({
        success: true,
        message: "Session started successfully",
        data: session,
      });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({
        success: false,
        message: "Error creating session",
        error: error.message,
      });
    }
  }
);

// @desc    Get session details by session ID
// @route   GET /api/sessions/:sessionId
// @access  Public
router.get("/:sessionId", async (req, res) => {
  try {
    const session = await Session.findOne({
      sessionId: req.params.sessionId,
    }).populate("course", "title code instructor description");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching session",
      error: error.message,
    });
  }
});

// @desc    End a session
// @route   PUT /api/sessions/:sessionId/end
// @access  Public (will be protected later)
router.put("/:sessionId/end", async (req, res) => {
  try {
    const session = await Session.findOne({
      sessionId: req.params.sessionId,
    }).populate("course", "title code");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (!session.isActive) {
      return res.status(400).json({
        success: false,
        message: "Session is already ended",
      });
    }

    await session.endSession();

    res.json({
      success: true,
      message: "Session ended successfully",
      data: session,
    });
  } catch (error) {
    console.error("Error ending session:", error);
    res.status(500).json({
      success: false,
      message: "Error ending session",
      error: error.message,
    });
  }
});

// @desc    Get all sessions for a course
// @route   GET /api/courses/:courseId/sessions
// @access  Public
router.get("/course/:courseId", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;

    // Verify course exists
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const query = { course: req.params.courseId };

    // Filter by status if specified
    if (status !== "all") {
      if (status === "active") {
        query.isActive = true;
      } else if (status === "ended") {
        query.isActive = false;
      }
    }

    const sessions = await Session.find(query)
      .populate("course", "title code")
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      success: true,
      count: sessions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: sessions,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sessions",
      error: error.message,
    });
  }
});

// @desc    Get active session for a course
// @route   GET /api/courses/:courseId/active-session
// @access  Public
router.get("/course/:courseId/active", async (req, res) => {
  try {
    const session = await Session.findOne({
      course: req.params.courseId,
      isActive: true,
    }).populate("course", "title code instructor");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found for this course",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching active session:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching active session",
      error: error.message,
    });
  }
});

module.exports = router;
