import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  content: String,
  status: String,
  answer: String,
  isPinned: Boolean,
  authorId: String,
  authorName: String,
  createdAt: Date,
  answeredAt: Date,
}, { collection: "Questions" });

const Question = mongoose.model("Question", questionSchema);

export default Question;
