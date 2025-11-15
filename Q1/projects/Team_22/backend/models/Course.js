const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Course title cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, "Course code cannot exceed 20 characters"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
      maxlength: [50, "Instructor name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
courseSchema.index({ code: 1 });
courseSchema.index({ instructor: 1 });

module.exports = mongoose.model("Course", courseSchema);
