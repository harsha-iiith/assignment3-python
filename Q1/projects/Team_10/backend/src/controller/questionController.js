import Question from "../models/questionModel.js";
import User from "../models/userModel.js";
import Lecture from "../models/lectureModel.js";

export async function createQuestion(req, res) {
  try {
    const { question, lectureId, isIMP } = req.body;
    const studentId = req.user._id;

    if(req.user.role!=='student')
    {
      return res.status(403).json({ error: "Forbidden: Access allowed only for students" });
    }

    if (!question || !lectureId) {
      return res.status(400).json({ error: "question and lectureId are required" });
    }

    const lectureExists = await Lecture.exists({ _id: lectureId });
    if (!lectureExists) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    const escaped = question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const duplicate = await Question.findOne({
      lectureId,
      question: { $regex: new RegExp(`^${escaped}$`, "i") } // case-insensitive exact match
    });

    if (duplicate) {
      return res
        .status(409)
        .json({ error: "Question already exists in this lecture." });
    }

    // --- Create Question ---
    const que = await Question.create({
      question,
      studentId,
      lectureId,
      isIMP: isIMP || false
    });

    return res.status(201).json({
      message: "Question created successfully",
      question: que
    });
  } catch (err) {
    console.error("Error creating question:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateQuestionStatus(req, res) {
  try {
    const {id} = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    const allowed = ["answered", "unanswered"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(", ")}` });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { status, answeredAt: status === "answered" ? new Date() : null },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({
      message: "Question status updated successfully",
      question
    });
  } catch (err) {
    console.error("Error updating question status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function clearQuestion(req, res) {
  try {
    //only a teacher can access this
    // question id is from url parameters
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(
      id,
      { isValid: false },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({
      message: "Question cleared successfully",
      question
    });
  } catch (err) {
    console.error("Error clearing question:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function getQuestions(req, res) {
  try {
    const { studentId, lectureId } = req.query; // use query string for GET

    if (!studentId && !lectureId) {
      return res
        .status(400)
        .json({ error: "Provide at least studentId or lectureId" });
    }

    const filter = {isValid: true};
    if (studentId) filter.studentId = studentId;
    if (lectureId) filter.lectureId = lectureId;

    const questions = await Question.find(filter)
      .populate("studentId", "name email")
      .populate("lectureId", "topic subject")
      .sort({ createdAt: -1 });

    res.json({ count: questions.length, questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateQuestion(req, res) {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id, 
      req.body, // This will pass { isIMP: true } or other fields
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ message: "Question updated successfully", question });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}