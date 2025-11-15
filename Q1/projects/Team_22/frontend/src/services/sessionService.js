import { get, post, put } from "./api";

/**
 * Fetch all questions for a session
 * @param {string} sessionId - Session ID
 * @param {object} params - Query params (status, student, page, limit)
 * @returns {Promise} - API response with questions
 */
export const getSessionQuestions = (sessionId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/sessions/${sessionId}/questions${queryParams ? `?${queryParams}` : ""}`;
  return get(url);
};

/**
 * Fetch questions grouped by student
 * @param {string} sessionId - Session ID
 * @param {object} params - Query params (status, etc.)
 * @returns {Promise} - API response with grouped questions
 */
export const getSessionQuestionsByStudent = (sessionId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/sessions/${sessionId}/questions/by-student${queryParams ? `?${queryParams}` : ""}`;
  return get(url);
};

/**
 * Session service - handles all session-related API calls
 */

/**
 * Create a new session for a course
 * @param {object} sessionData - Session information
 * @param {string} sessionData.courseId - Course ID
 * @param {string} sessionData.instructor - Instructor name
 * @returns {Promise} - API response with created session
 */
export const createSession = (sessionData) => {
  return post("/sessions", sessionData);
};

/**
 * Get session details by session ID
 * @param {string} sessionId - Session ID
 * @returns {Promise} - API response with session data
 */
export const getSession = (sessionId) => {
  return get(`/sessions/${sessionId}`);
};

/**
 * End/stop a session
 * @param {string} sessionId - Session ID to end
 * @returns {Promise} - API response
 */
export const endSession = (sessionId) => {
  return put(`/sessions/${sessionId}/end`, {});
};

/**
 * Get all sessions for a specific course
 * @param {string} courseId - Course ID
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (optional)
 * @param {number} params.limit - Items per page (optional)
 * @param {string} params.status - Session status filter ('all', 'active', 'ended') (optional)
 * @returns {Promise} - API response with sessions array
 */
export const getCourseSessions = (courseId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/sessions/course/${courseId}${
    queryParams ? `?${queryParams}` : ""
  }`;
  return get(url);
};

/**
 * Get active session for a course
 * @param {string} courseId - Course ID
 * @returns {Promise} - API response with active session data
 */
export const getActiveCourseSession = (courseId) => {
  return get(`/sessions/course/${courseId}/active`);
};

/**
 * Get session by ID (alias for getSession to match student component usage)
 */
export const getSessionById = (sessionId) => {
  return getSession(sessionId);
};

// Default export for convenience
const sessionService = {
  createSession,
  getSession,
  getSessionById,
  endSession,
  getCourseSessions,
  getActiveCourseSession,
  getSessionQuestions,
  getSessionQuestionsByStudent,
};

export default sessionService;
