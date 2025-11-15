// Utility functions for session management

export const formatSessionConflictMessage = (existingSession) => {
  return `A live session already exists for this course.

Session Details:
• Session ID: ${existingSession.sessionId}
• Created by: ${existingSession.createdBy.name}
• Started at: ${new Date(existingSession.startAt).toLocaleString()}

Please end the current session before creating a new one.`;
};

export const getErrorMessage = (error) => {
  if (error.response?.status === 409 && error.response.data?.existingSession) {
    return formatSessionConflictMessage(error.response.data.existingSession);
  }
  return error.response?.data?.message || error.message || "An unexpected error occurred";
};