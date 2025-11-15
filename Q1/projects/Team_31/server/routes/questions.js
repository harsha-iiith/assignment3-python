const express = require('express');
const router = express.Router();

// Import controller functions.
const {
  createQuestion,
  getQuestions,
  updateQuestion,
  clearBoard
} = require('../controllers/questionsController');

// This function takes the `io` object and returns the configured router
module.exports = (io) => {
  // GET /api/questions - Get all questions
  router.get('/', getQuestions);

  // POST /api/questions - Create a new question
  router.post('/', createQuestion(io));

  // PATCH /api/questions/:id - Update a single question
  router.patch('/:id', updateQuestion(io));

  // DELETE /api/questions - Clear the entire board
  router.delete('/', clearBoard(io));

  return router;
};
