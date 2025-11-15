import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: String,
  lectures: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }
  ]
}, { collection: "Courses" });

const Course = mongoose.model("Course", courseSchema);

export default Course;
