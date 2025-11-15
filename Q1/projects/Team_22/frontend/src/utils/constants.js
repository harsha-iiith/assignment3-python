// Application constants
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const QUESTION_STATUS = {
  UNANSWERED: "unanswered",
  ANSWERED: "answered",
  IMPORTANT: "important",
};

export const USER_ROLES = {
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

export const COLORS = {
  primary: "#4A90E2",
  secondary: "#F5A623",
  success: "#7ED321",
  warning: "#F5A623",
  danger: "#D0021B",
  info: "#9013FE",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#212529",
  muted: "#6C757D",
};

export const STICKY_NOTE_COLORS = {
  [QUESTION_STATUS.UNANSWERED]: "#FFEB3B",
  [QUESTION_STATUS.ANSWERED]: "#4CAF50",
  [QUESTION_STATUS.IMPORTANT]: "#FF5722",
  answered_important: "#9C27B0",
};

export const ROUTES = {
  HOME: "/",
  INSTRUCTOR: "/instructor",
  STUDENT: "/student",
};

export const VALIDATION_RULES = {
  STUDENT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  QUESTION: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 1000,
  },
  SESSION_ID: {
    PATTERN: /^VV-[A-Z0-9]{6,8}$/,
  },
};

export const UI_MESSAGES = {
  LOADING: "Loading...",
  ERROR: "Something went wrong. Please try again.",
  SUCCESS: "Success!",
  NETWORK_ERROR: "Network error. Please check your connection.",
  VALIDATION_ERROR: "Please check your input and try again.",
};

export const DEBOUNCE_DELAY = 300; // milliseconds
export const POLLING_INTERVAL = 5000; // milliseconds for real-time updates
