import Lecture from "../models/lectureModel.js";
import User from "../models/userModel.js";

export async function createLecture(req, res) {
  try {
    const { topic, subject, status, dateTime } = req.body;

    const teacherId = req.user._id;

    if (!topic || !subject) {
      return res
        .status(400)
        .json({ error: "topic, and subject are required" });
    }

    const duplicateLecture = await Lecture.exists({
      topic,
      teacherId,
      subject
    });

    if (duplicateLecture) {
      return res.status(400).json({
        error: "Duplicate lecture: a lecture with these details already exists",
      });
    }

    const lecture = await Lecture.create({
      topic,
      teacherId,
      subject,
      status: status || "pending",
      dateTime,
    });

    res
      .status(201)
      .json({ message: "Lecture created successfully", lecture });
  } catch (err) {
    console.error("Error creating lecture:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function changeLectureStatus(req, res) {
  
  try {
    const { id } = req.params; // This is the lecture's ID from the URL
    const { status } = req.body;

    // THE FIX IS HERE: Get the logged-in user's ID from req.user
    // const loggedInUserId = req.user._id;

    if (!status) {
      return res.status(400).json({
        error: "status required",
      });
    }

    const allowedStatuses = ["pending", "live", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // // This check now correctly compares the lecture's creator with the logged-in user
    // if (lecture.teacherId.toString() !== loggedInUserId.toString()) {
    //   return res.status(403).json({ error: "Not authorised to update this lecture" });
    // }

    lecture.status = status;
    await lecture.save();

    return res.status(200).json({
      message: "Lecture status updated successfully",
      lecture,
    });
  } catch (err) {
    console.error("Error updating lecture status:", err);
    return res.status(500).json({ error: "Internal server error3" });
  }

}


export async function getLectures(req, res) {
  try {
    
    const loggedInUser = req.user;
    const { teacherId } = req.query; // Optional filter from query string

    const filter = {};

    if (loggedInUser.role === 'teacher') {
      // If the user is a teacher, they can ONLY see their own lectures.
      filter.teacherId = loggedInUser._id;
    } else if (loggedInUser.role === 'student') {
      // If the user is a student, they can see all lectures by default.
      if (teacherId) {
        filter.teacherId = teacherId;
      }
    }

    // 3. Execute the database query with the constructed filter
    const lectures = await Lecture.find(filter)
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      count: lectures.length,
      lectures
    });

  } catch (err) {
    console.error("Error fetching lectures:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}