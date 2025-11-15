const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  status: {
    type: String,
    enum: ["unanswered", "answered", "important", "archived"],
    default: "unanswered",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", QuestionSchema);
