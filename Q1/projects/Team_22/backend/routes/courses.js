const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Course } = require("../models");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Public (will be protected later)
router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Course title is required")
      .isLength({ max: 100 })
      .withMessage("Course title cannot exceed 100 characters"),
    body("code")
      .trim()
      .notEmpty()
      .withMessage("Course code is required")
      .isLength({ max: 20 })
      .withMessage("Course code cannot exceed 20 characters"),
    body("instructor")
      .trim()
      .notEmpty()
      .withMessage("Instructor name is required")
      .isLength({ max: 50 })
      .withMessage("Instructor name cannot exceed 50 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
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

      const { title, code, instructor, description } = req.body;

      // Check if course with same code already exists
      const existingCourse = await Course.findOne({ code: code.toUpperCase() });
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: "Course with this code already exists",
        });
      }

      const course = await Course.create({
        title,
        code: code.toUpperCase(),
        instructor,
        description,
      });

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({
        success: false,
        message: "Error creating course",
        error: error.message,
      });
    }
  }
);

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Public (will be protected later)
router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Course title cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Course title cannot exceed 100 characters"),
    body("code")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Course code cannot be empty")
      .isLength({ max: 20 })
      .withMessage("Course code cannot exceed 20 characters"),
    body("instructor")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Instructor name cannot be empty")
      .isLength({ max: 50 })
      .withMessage("Instructor name cannot exceed 50 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
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

      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // If updating code, check for duplicates
      if (req.body.code && req.body.code.toUpperCase() !== course.code) {
        const existingCourse = await Course.findOne({
          code: req.body.code.toUpperCase(),
          _id: { $ne: req.params.id },
        });
        if (existingCourse) {
          return res.status(400).json({
            success: false,
            message: "Course with this code already exists",
          });
        }
      }

      const updatedData = { ...req.body };
      if (updatedData.code) {
        updatedData.code = updatedData.code.toUpperCase();
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({
        success: false,
        message: "Error updating course",
        error: error.message,
      });
    }
  }
);

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Public (will be protected later)
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
});

module.exports = router;
