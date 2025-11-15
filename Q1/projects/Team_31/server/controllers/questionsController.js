const Question = require('../models/Question');
const mongoose = require('mongoose');

/**
 * @desc    Create a new question
 * @param   {object} io - The Socket.IO server instance
 */
const createQuestion = (io) => async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({ message: "Text and author are required" });
    }

    const existingQuestion = await Question.findOne({
      text: { $regex: new RegExp(`^${text.trim()}$`, 'i') }
    });

    if (existingQuestion) {
      // If a duplicate is found, return a 409 Conflict error.
      return res.status(409).json({ message: "This question has already been asked." });
    }

    const question = await Question.create({ text, author });

    // Emit the new question to all connected clients
    io.emit('newQuestion', question);

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Get all questions with filtering
 */
const getQuestions = async (req, res) => {
  try {
    const { status, isImportant, author, sort = '-createdAt', isArchived } = req.query;

    // Build the filter object more explicitly
    const filter = {};

    // Default to showing non-archived questions unless the archive is specifically requested
    if (isArchived !== undefined) {
      filter.isArchived = isArchived === 'true';
    } else {
      filter.isArchived = false;
    }

    if (status && ['unanswered', 'answered'].includes(status)) {
      filter.status = status;
    }
    if (isImportant !== undefined) {
      filter.isImportant = isImportant === 'true';
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }

    const allowedSortFields = ['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'author', '-author'];
    const sortOption = allowedSortFields.includes(sort) ? sort : '-createdAt';

    const questions = await Question.find(filter).sort(sortOption);

    res.status(200).json({
      message: "Questions retrieved successfully",
      count: questions.length,
      data: questions
    });

  } catch (err) {
    // Add a console log to see the specific error on your server
    console.error('ERROR fetching questions:', err);
    res.status(500).json({ message: 'Server error while fetching questions.' });
  }
};

/**
 * @desc    Update a question
 * @param   {object} io - The Socket.IO server instance
 */
const updateQuestion = (io) => async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isImportant } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }

    // Validate input
    if (status && !['answered', 'unanswered'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (typeof isImportant === 'boolean') updateData.isImportant = isImportant;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Update document
    const question = await Question.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Emit the update to all connected clients
    io.emit('questionUpdated', question);

    // Respond with updated question
    res.status(200).json(question);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Archive all active questions (non-destructive "clear")
 * @param   {object} io - The Socket.IO server instance
 */
const clearBoard = (io) => async (req, res) => {
  try {
    await Question.updateMany({ isArchived: false }, { $set: { isArchived: true } });

    // Notify all clients that the board has been cleared
    io.emit('boardCleared');

    res.status(200).json({ message: "All questions cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  updateQuestion,
  clearBoard
};
