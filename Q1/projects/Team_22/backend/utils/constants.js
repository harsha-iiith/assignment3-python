// Application constants
const QUESTION_STATUS = {
  UNANSWERED: "unanswered",
  ANSWERED: "answered",
  IMPORTANT: "important",
};

const USER_ROLES = {
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

const SESSION_STATUS = {
  ACTIVE: "active",
  ENDED: "ended",
};

const API_MESSAGES = {
  SUCCESS: {
    COURSE_CREATED: "Course created successfully",
    COURSE_UPDATED: "Course updated successfully",
    COURSE_DELETED: "Course deleted successfully",
    SESSION_STARTED: "Session started successfully",
    SESSION_ENDED: "Session ended successfully",
    QUESTION_POSTED: "Question posted successfully",
    QUESTION_UPDATED: "Question status updated successfully",
    QUESTION_DELETED: "Question deleted successfully",
  },
  ERROR: {
    COURSE_NOT_FOUND: "Course not found",
    COURSE_CODE_EXISTS: "Course with this code already exists",
    SESSION_NOT_FOUND: "Session not found",
    SESSION_ALREADY_ACTIVE: "An active session already exists for this course",
    SESSION_NOT_ACTIVE: "Session is no longer active",
    SESSION_ALREADY_ENDED: "Session is already ended",
    QUESTION_NOT_FOUND: "Question not found",
    DUPLICATE_QUESTION: "You have already posted this exact question",
    VALIDATION_ERROR: "Validation errors",
    INVALID_SESSION_ID: "Invalid session ID format",
    SERVER_ERROR: "Internal server error",
  },
};

const VALIDATION_RULES = {
  COURSE: {
    TITLE_MAX_LENGTH: 100,
    CODE_MAX_LENGTH: 20,
    INSTRUCTOR_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 500,
  },
  QUESTION: {
    CONTENT_MIN_LENGTH: 5,
    CONTENT_MAX_LENGTH: 1000,
    STUDENT_NAME_MAX_LENGTH: 50,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
  },
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  QUESTION_STATUS,
  USER_ROLES,
  SESSION_STATUS,
  API_MESSAGES,
  VALIDATION_RULES,
  HTTP_STATUS,
};
