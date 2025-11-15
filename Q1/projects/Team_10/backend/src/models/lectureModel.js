import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  teacherId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic:      { type: String, required: true },
  description:{ type: String },  // optional detailed summary
  subject:    { type: String, required: true },
  status:     { type: String, enum: ["pending", "live", "completed", "cancelled"], default: "pending" },
  dateTime:   { type: Date },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

export default mongoose.model("Lecture", lectureSchema);
