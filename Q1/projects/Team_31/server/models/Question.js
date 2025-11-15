const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a question text'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['unanswered', 'answered'],
      default: 'unanswered',
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // auto add createdAt and updatedAt
  }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
