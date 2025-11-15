const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, "Session ID is required"],
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session reference is required"],
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [50, "Student name cannot exceed 50 characters"],
    },
    content: {
      type: String,
      required: [true, "Question content is required"],
      trim: true,
      minlength: [5, "Question must be at least 5 characters long"],
      maxlength: [1000, "Question cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["unanswered", "answered", "important"],
      default: "unanswered",
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // For tracking when status was last updated
    lastStatusUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
questionSchema.index({ sessionId: 1, timestamp: -1 });
questionSchema.index({ sessionId: 1, status: 1 });
questionSchema.index({ sessionId: 1, isAnswered: 1 });
questionSchema.index({ sessionId: 1, isImportant: 1 });
questionSchema.index({ studentName: 1, sessionId: 1 });

// Pre-save middleware to update status based on boolean flags
questionSchema.pre("save", function (next) {
  if (this.isModified("isAnswered") || this.isModified("isImportant")) {
    if (this.isAnswered && this.isImportant) {
      this.status = "important"; // Important takes precedence in status field
    } else if (this.isAnswered) {
      this.status = "answered";
    } else if (this.isImportant) {
      this.status = "important";
    } else {
      this.status = "unanswered";
    }
    this.lastStatusUpdate = new Date();
  }
  next();
});

// Static method to get questions by status
questionSchema.statics.getByStatus = function (sessionId, status) {
  const query = { sessionId };

  switch (status) {
    case "answered":
      query.isAnswered = true;
      break;
    case "unanswered":
      query.isAnswered = false;
      break;
    case "important":
      query.isImportant = true;
      break;
    default:
      // Return all questions if status is 'all' or invalid
      break;
  }

  return this.find(query).sort({ timestamp: -1 });
};

// Method to mark as answered
questionSchema.methods.markAsAnswered = function () {
  this.isAnswered = true;
  return this.save();
};

// Method to mark as important
questionSchema.methods.markAsImportant = function () {
  this.isImportant = true;
  return this.save();
};

// Method to toggle status
questionSchema.methods.toggleStatus = function (statusType) {
  if (statusType === "answered") {
    this.isAnswered = !this.isAnswered;
  } else if (statusType === "important") {
    this.isImportant = !this.isImportant;
  }
  return this.save();
};

module.exports = mongoose.model("Question", questionSchema);
