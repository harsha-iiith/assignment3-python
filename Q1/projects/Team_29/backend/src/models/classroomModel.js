import mongoose from "mongoose";

const classroomSchema = mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinCode: { type: String, required: true, unique: true },
}, { timestamps: true });

const Classroom = mongoose.model("Classroom", classroomSchema);
export default Classroom;