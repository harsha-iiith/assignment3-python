import React, { createContext, useContext, useReducer, useEffect } from "react";
import { USER_ROLES } from "../utils/constants";

// Initial state
const initialState = {
  // User and session state
  userRole: null,
  currentSession: null,
  currentCourse: null,

  // Student specific state
  studentName: "",
  sessionJoined: false,

  // UI state
  loading: false,
  error: null,
  success: null,

  // Real-time data
  questions: [],
  questionsByStudent: {},

  // Filters and preferences
  filters: {
    status: "all", // 'all', 'answered', 'unanswered', 'important'
    student: "",
  },

  // Connection status
  isOnline: navigator.onLine || true,
};

// Action types
export const ActionTypes = {
  // User actions
  SET_USER_ROLE: "SET_USER_ROLE",
  SET_CURRENT_SESSION: "SET_CURRENT_SESSION",
  SET_CURRENT_COURSE: "SET_CURRENT_COURSE",
  CLEAR_SESSION: "CLEAR_SESSION",

  // Student actions
  SET_STUDENT_NAME: "SET_STUDENT_NAME",
  SET_SESSION_JOINED: "SET_SESSION_JOINED",

  // UI actions
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",

  // Question actions
  SET_QUESTIONS: "SET_QUESTIONS",
  ADD_QUESTION: "ADD_QUESTION",
  UPDATE_QUESTION: "UPDATE_QUESTION",
  REMOVE_QUESTION: "REMOVE_QUESTION",
  SET_QUESTIONS_BY_STUDENT: "SET_QUESTIONS_BY_STUDENT",

  // Filter actions
  SET_STATUS_FILTER: "SET_STATUS_FILTER",
  SET_STUDENT_FILTER: "SET_STUDENT_FILTER",
  CLEAR_FILTERS: "CLEAR_FILTERS",

  // Connection actions
  SET_ONLINE_STATUS: "SET_ONLINE_STATUS",
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_ROLE:
      return {
        ...state,
        userRole: action.payload,
      };

    case ActionTypes.SET_CURRENT_SESSION:
      return {
        ...state,
        currentSession: action.payload,
        questions: [], // Clear questions when session changes
        questionsByStudent: {},
      };

    case ActionTypes.SET_CURRENT_COURSE:
      return {
        ...state,
        currentCourse: action.payload,
      };

    case ActionTypes.CLEAR_SESSION:
      return {
        ...state,
        currentSession: null,
        currentCourse: null,
        questions: [],
        questionsByStudent: {},
        filters: initialState.filters,
        sessionJoined: false,
        studentName: "",
      };

    case ActionTypes.SET_STUDENT_NAME:
      return {
        ...state,
        studentName: action.payload,
      };

    case ActionTypes.SET_SESSION_JOINED:
      return {
        ...state,
        sessionJoined: action.payload,
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ActionTypes.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
        loading: false,
      };

    case ActionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
        success: null,
      };

    case ActionTypes.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };

    case ActionTypes.ADD_QUESTION:
      return {
        ...state,
        questions: [...state.questions, action.payload],
      };

    case ActionTypes.UPDATE_QUESTION:
      return {
        ...state,
        questions: state.questions.map((q) =>
          q._id === action.payload._id ? { ...q, ...action.payload } : q
        ),
      };

    case ActionTypes.REMOVE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter((q) => q._id !== action.payload),
      };

    case ActionTypes.SET_QUESTIONS_BY_STUDENT:
      return {
        ...state,
        questionsByStudent: action.payload,
      };

    case ActionTypes.SET_STATUS_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          status: action.payload,
        },
      };

    case ActionTypes.SET_STUDENT_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          student: action.payload,
        },
      };

    case ActionTypes.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
      };

    case ActionTypes.SET_ONLINE_STATUS:
      return {
        ...state,
        isOnline: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    // User actions
    setUserRole: (role) => {
      dispatch({ type: ActionTypes.SET_USER_ROLE, payload: role });
      sessionStorage.setItem("userRole", role);
    },

    setCurrentSession: (session) => {
      dispatch({ type: ActionTypes.SET_CURRENT_SESSION, payload: session });
      if (session) {
        sessionStorage.setItem("currentSession", JSON.stringify(session));
      } else {
        sessionStorage.removeItem("currentSession");
      }
    },

    setCurrentCourse: (course) => {
      dispatch({ type: ActionTypes.SET_CURRENT_COURSE, payload: course });
      if (course) {
        sessionStorage.setItem("currentCourse", JSON.stringify(course));
      } else {
        sessionStorage.removeItem("currentCourse");
      }
    },

    clearSession: () => {
      dispatch({ type: ActionTypes.CLEAR_SESSION });
      sessionStorage.removeItem("currentSession");
      sessionStorage.removeItem("currentCourse");
      sessionStorage.removeItem("studentName");
      sessionStorage.removeItem("sessionJoined");
    },

    // Student actions
    setStudentName: (name) => {
      dispatch({ type: ActionTypes.SET_STUDENT_NAME, payload: name });
      sessionStorage.setItem("studentName", name);
    },

    setSessionJoined: (joined) => {
      dispatch({ type: ActionTypes.SET_SESSION_JOINED, payload: joined });
      sessionStorage.setItem("sessionJoined", joined.toString());
    },

    // UI actions
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        dispatch({ type: ActionTypes.CLEAR_MESSAGES });
      }, 5000);
    },

    setSuccess: (success) => {
      dispatch({ type: ActionTypes.SET_SUCCESS, payload: success });
      // Auto-clear success after 3 seconds
      setTimeout(() => {
        dispatch({ type: ActionTypes.CLEAR_MESSAGES });
      }, 3000);
    },

    clearMessages: () => {
      dispatch({ type: ActionTypes.CLEAR_MESSAGES });
    },

    // Question actions
    setQuestions: (questions) => {
      dispatch({ type: ActionTypes.SET_QUESTIONS, payload: questions });
    },

    addQuestion: (question) => {
      dispatch({ type: ActionTypes.ADD_QUESTION, payload: question });
    },

    updateQuestion: (question) => {
      dispatch({ type: ActionTypes.UPDATE_QUESTION, payload: question });
    },

    removeQuestion: (questionId) => {
      dispatch({ type: ActionTypes.REMOVE_QUESTION, payload: questionId });
    },

    setQuestionsByStudent: (questionsByStudent) => {
      dispatch({
        type: ActionTypes.SET_QUESTIONS_BY_STUDENT,
        payload: questionsByStudent,
      });
    },

    // Filter actions
    setStatusFilter: (status) => {
      dispatch({ type: ActionTypes.SET_STATUS_FILTER, payload: status });
    },

    setStudentFilter: (student) => {
      dispatch({ type: ActionTypes.SET_STUDENT_FILTER, payload: student });
    },

    clearFilters: () => {
      dispatch({ type: ActionTypes.CLEAR_FILTERS });
    },

    // Reset app to initial state
    resetApp: () => {
      // Clear sessionStorage
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("currentSession");
      sessionStorage.removeItem("currentCourse");
      sessionStorage.removeItem("studentName");
      sessionStorage.removeItem("sessionJoined");

      // Reset state to initial
      dispatch({ type: ActionTypes.SET_USER_ROLE, payload: null });
      dispatch({ type: ActionTypes.CLEAR_SESSION });
      dispatch({ type: ActionTypes.CLEAR_MESSAGES });
    },
  };

  // Load persisted state on mount
  useEffect(() => {
    try {
      const savedUserRole = sessionStorage.getItem("userRole");
      const savedSession = sessionStorage.getItem("currentSession");
      const savedCourse = sessionStorage.getItem("currentCourse");
      const savedStudentName = sessionStorage.getItem("studentName");
      const savedSessionJoined = sessionStorage.getItem("sessionJoined");

      if (savedUserRole && Object.values(USER_ROLES).includes(savedUserRole)) {
        dispatch({ type: ActionTypes.SET_USER_ROLE, payload: savedUserRole });
      }

      if (savedSession) {
        dispatch({
          type: ActionTypes.SET_CURRENT_SESSION,
          payload: JSON.parse(savedSession),
        });
      }

      if (savedCourse) {
        dispatch({
          type: ActionTypes.SET_CURRENT_COURSE,
          payload: JSON.parse(savedCourse),
        });
      }

      if (savedStudentName) {
        dispatch({
          type: ActionTypes.SET_STUDENT_NAME,
          payload: savedStudentName,
        });
      }

      if (savedSessionJoined === "true") {
        dispatch({ type: ActionTypes.SET_SESSION_JOINED, payload: true });
      }
    } catch (error) {
      console.error("Error loading persisted state:", error);
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () =>
      dispatch({ type: ActionTypes.SET_ONLINE_STATUS, payload: true });
    const handleOffline = () =>
      dispatch({ type: ActionTypes.SET_ONLINE_STATUS, payload: false });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
