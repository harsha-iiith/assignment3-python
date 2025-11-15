const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    questionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
sessionSchema.index({ sessionId: 1 });
sessionSchema.index({ course: 1 });
sessionSchema.index({ isActive: 1 });
sessionSchema.index({ startTime: -1 });

// Virtual for session duration
sessionSchema.virtual("duration").get(function () {
  if (this.endTime) {
    return this.endTime - this.startTime;
  }
  return Date.now() - this.startTime;
});

// Method to end session
sessionSchema.methods.endSession = function () {
  this.isActive = false;
  this.endTime = new Date();
  return this.save();
};

module.exports = mongoose.model("Session", sessionSchema);
