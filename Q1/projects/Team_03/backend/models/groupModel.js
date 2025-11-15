const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["unanswered", "answered"],
    default: "unanswered"
  },
  important: {
    type: String,
    enum: ["yes", "no"],
    default: "no"
  },
  questionText: {
    type: String,
  },
  questionTimestamp: {
    type: Date,
    default: Date.now
  },
  answerText: {
    type: String,
    default: ""
  },
  answerTimestamp: {
    type: Date,
  }
});

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true
  },
  faculty: {
    type: String,
    required: true
  },
  facultyId: {
    type: String,
    required: true
  },
  accessCode: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status : {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing"
  },
  questions : [questionSchema]
});

module.exports = mongoose.model('Groups', groupSchema);