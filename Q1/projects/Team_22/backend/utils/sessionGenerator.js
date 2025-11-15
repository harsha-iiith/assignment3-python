const { v4: uuidv4 } = require("uuid");

/**
 * Generate a unique session ID
 * Format: VV-XXXXXX (6 uppercase alphanumeric characters)
 * @returns {string} - Unique session ID
 */
const generateSessionId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "VV-";

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

/**
 * Generate a UUID-based session ID (alternative method)
 * @returns {string} - UUID-based session ID
 */
const generateUUIDSessionId = () => {
  return `VV-${uuidv4().substring(0, 8).toUpperCase()}`;
};

/**
 * Validate session ID format
 * @param {string} sessionId - Session ID to validate
 * @returns {boolean} - Whether the session ID is valid
 */
const isValidSessionId = (sessionId) => {
  const sessionIdRegex = /^VV-[A-Z0-9]{6,8}$/;
  return sessionIdRegex.test(sessionId);
};

module.exports = {
  generateSessionId,
  generateUUIDSessionId,
  isValidSessionId,
};
