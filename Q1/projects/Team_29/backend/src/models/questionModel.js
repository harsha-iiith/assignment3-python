import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Classroom",
    },
    status: {
      type: String,
      required: true,
      enum: ["unanswered", "answered", "important"],
      default: "unanswered",
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
