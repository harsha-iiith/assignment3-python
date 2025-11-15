
import api from './api';

export const questionService = {
  createQuestion: async (questionData) => {
    try {
      const classId = questionData.classId || "default-class";
      try {
        const response = await api.post("/student/createQuery", {
          queryText: questionData.text,
          classId: classId,
        });
        return {
          success: true,
          data: {
            id: response.data.data._id,
            text: response.data.data.queryText,
            author: questionData.author || "Current User",
            status: response.data.data.status || "Unanswered",
            createdAt: response.data.data.createdAt,
            classId: classId,
          },
          message: response.data.message,
        };
      } catch (apiError) {
        return {
          success: false,
          message:
            apiError.response?.data?.message || "Failed to create question",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to create question",
      };
    }
  },
  deleteQuestion: async (questionId) => {
    try {
      const response = await api.delete(`/teacher/deleteQuery/${questionId}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete question",
      };
    }
  },
  // Get questions created by the current student
  getQuestionsByClassId: async (classId) => {
    try {
      const response = await api.get(
        `/student/getCreatedQueries?classId=${classId}`
      );
      return {
        success: true,
        data: response.data.data.map((query) => ({
          id: query._id,
          text: query.queryText,
          author: query.student?.Name || "Unknown",
          authorEmail: query.student?.email || "",
          status: query.status || "Unanswered",
          isImportant: query.isImportant || false,
          createdAt: query.createdAt,
          classId: query.class || classId,
        })),
      };
    } catch (apiError) {
      return {
        success: false,
        message:
          apiError.response?.data?.message || "Failed to fetch questions",
      };
    }
  },

  updateQuestion: async (questionId, updates) => {
    let endpoint = null;
    let payload = { queryId: questionId };
    if (updates.status === "Answered" || updates.status === "Unanswered") {
      endpoint = "/teacher/answerQuery";
      payload.statusValue = updates.status;
    } else if (Object.prototype.hasOwnProperty.call(updates, "isImportant")) {
      endpoint = "/teacher/impQuery";
      payload.isImportant = updates.isImportant;
    }
    if (endpoint) {
      try {
        const response = await api.post(endpoint, payload);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "Failed to update question via API",
        };
      }
    }
    return {
      success: false,
      message: "Update failed: Action not supported by API or logic error.",
    };
  },

  getAllQuestionsForClass: async (classId) => {
    try {
      const response = await api.get(
        `/teacher/getAllClassQueries?classId=${classId}`
      );
      return {
        success: true,
        data: response.data.data.map((query) => ({
          id: query._id,
          text: query.queryText,
          author: query.student?.Name || "Unknown",
          authorEmail: query.student?.email || "",
          status: query.status || "Unanswered",
          isImportant: query.isImportant || false,
          createdAt: query.createdAt,
          classId: query.class,
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch questions",
      };
    }
  },

};