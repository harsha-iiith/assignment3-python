const Question = require("../models/Question");

exports.createQuestion = async (req, res) => {
  const { text, classId } = req.body;
  try {
    // Check if question already exists for this class
    const existingQuestion = await Question.findOne({ 
      text: text.trim(), 
      class: classId 
    });
    
    if (existingQuestion) {
      return res.status(400).json({ 
        message: "Question already exists in this class",
        existingQuestion: existingQuestion
      });
    }

    const q = await Question.create({ text, author: req.user._id, class: classId });
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ class: req.params.classId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuestionStatus = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: "Question not found" });

    q.status = req.body.status || q.status;
    await q.save();
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
