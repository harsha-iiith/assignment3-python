import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  name: String,
  questions: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }
  ],
  lectureDate: Date
}, { collection: "Lectures",timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
