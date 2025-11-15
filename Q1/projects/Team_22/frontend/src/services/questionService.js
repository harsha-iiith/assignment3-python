import { get, post, put, del } from "./api";

/**
 * Question service - handles all question-related API calls
 */

/**
 * Post a new question to a session
 * @param {object} questionData - Question information
 * @param {string} questionData.sessionId - Session ID
 * @param {string} questionData.studentName - Student name
 * @param {string} questionData.content - Question content
 * @returns {Promise} - API response with created question
 */
export const postQuestion = (questionData) => {
  return post("/questions", questionData);
};

/**
 * Get all questions for a session
 * @param {string} sessionId - Session ID
 * @param {object} params - Query parameters
 * @param {string} params.status - Status filter ('all', 'answered', 'unanswered', 'important') (optional)
 * @param {string} params.student - Student name filter (optional)
 * @param {number} params.page - Page number (optional)
 * @param {number} params.limit - Items per page (optional)
 * @returns {Promise} - API response with questions array
 */
export const getSessionQuestions = (sessionId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/questions/session/${sessionId}${
    queryParams ? `?${queryParams}` : ""
  }`;
  return get(url);
};

/**
 * Get questions grouped by student for a session
 * @param {string} sessionId - Session ID
 * @param {object} params - Query parameters
 * @param {string} params.status - Status filter ('all', 'answered', 'unanswered', 'important') (optional)
 * @returns {Promise} - API response with grouped questions
 */
export const getSessionQuestionsByStudent = (sessionId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/questions/session/${sessionId}/by-student${
    queryParams ? `?${queryParams}` : ""
  }`;
  return get(url);
};

/**
 * Update question status
 * @param {string} questionId - Question ID
 * @param {object} statusData - Status update information
 * @param {string} statusData.action - Action to perform ('toggle_answered', 'toggle_important', 'mark_answered', 'mark_important', 'unmark_answered', 'unmark_important')
 * @returns {Promise} - API response with updated question
 */
export const updateQuestionStatus = (questionId, statusData) => {
  return put(`/questions/${questionId}/status`, statusData);
};

/**
 * Delete a question
 * @param {string} questionId - Question ID
 * @returns {Promise} - API response
 */
export const deleteQuestion = (questionId) => {
  return del(`/questions/${questionId}`);
};

/**
 * Mark question as answered
 * @param {string} questionId - Question ID
 * @returns {Promise} - API response with updated question
 */
export const markQuestionAnswered = (questionId) => {
  return updateQuestionStatus(questionId, { action: "mark_answered" });
};

/**
 * Mark question as important
 * @param {string} questionId - Question ID
 * @returns {Promise} - API response with updated question
 */
export const markQuestionImportant = (questionId) => {
  return updateQuestionStatus(questionId, { action: "mark_important" });
};

/**
 * Toggle question answered status
 * @param {string} questionId - Question ID
 * @returns {Promise} - API response with updated question
 */
export const toggleQuestionAnswered = (questionId) => {
  return updateQuestionStatus(questionId, { action: "toggle_answered" });
};

/**
 * Toggle question important status
 * @param {string} questionId - Question ID
 * @returns {Promise} - API response with updated question
 */
export const toggleQuestionImportant = (questionId) => {
  return updateQuestionStatus(questionId, { action: "toggle_important" });
};

// Default export for convenience
const questionService = {
  createQuestion: postQuestion, // Alias for compatibility
  postQuestion,
  getQuestionsBySession: getSessionQuestions, // Alias for compatibility
  getSessionQuestions,
  getSessionQuestionsByStudent,
  updateQuestionStatus,
  deleteQuestion,
  markQuestionAnswered,
  markQuestionImportant,
  toggleQuestionAnswered,
  toggleQuestionImportant,
};

export default questionService;
