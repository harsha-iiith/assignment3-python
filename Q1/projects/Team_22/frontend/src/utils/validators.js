import { VALIDATION_RULES } from "./constants";

/**
 * Validate student name
 * @param {string} name - Student name to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateStudentName = (name) => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: "Student name is required",
    };
  }

  if (name.trim().length > VALIDATION_RULES.STUDENT_NAME.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Student name cannot exceed ${VALIDATION_RULES.STUDENT_NAME.MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate question content
 * @param {string} content - Question content to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateQuestionContent = (content) => {
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      error: "Question content is required",
    };
  }

  if (content.trim().length < VALIDATION_RULES.QUESTION.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Question must be at least ${VALIDATION_RULES.QUESTION.MIN_LENGTH} characters long`,
    };
  }

  if (content.trim().length > VALIDATION_RULES.QUESTION.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Question cannot exceed ${VALIDATION_RULES.QUESTION.MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate session ID format
 * @param {string} sessionId - Session ID to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateSessionId = (sessionId) => {
  if (!sessionId || sessionId.trim().length === 0) {
    return {
      isValid: false,
      error: "Session ID is required",
    };
  }

  if (!VALIDATION_RULES.SESSION_ID.PATTERN.test(sessionId.trim())) {
    return {
      isValid: false,
      error: "Invalid session ID format. Expected format: VV-XXXXXX",
    };
  }

  return { isValid: true };
};

/**
 * Validate course information
 * @param {object} course - Course object with title, code, instructor
 * @returns {object} - Validation result with isValid and errors array
 */
export const validateCourse = (course) => {
  const errors = [];

  if (!course.title || course.title.trim().length === 0) {
    errors.push("Course title is required");
  } else if (course.title.trim().length > 100) {
    errors.push("Course title cannot exceed 100 characters");
  }

  if (!course.code || course.code.trim().length === 0) {
    errors.push("Course code is required");
  } else if (course.code.trim().length > 20) {
    errors.push("Course code cannot exceed 20 characters");
  }

  if (!course.instructor || course.instructor.trim().length === 0) {
    errors.push("Instructor name is required");
  } else if (course.instructor.trim().length > 50) {
    errors.push("Instructor name cannot exceed 50 characters");
  }

  if (course.description && course.description.trim().length > 500) {
    errors.push("Description cannot exceed 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize input string
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate form data generically
 * @param {object} data - Form data object
 * @param {object} rules - Validation rules object
 * @returns {object} - Validation result
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    if (
      rule.required &&
      (!value || (typeof value === "string" && value.trim().length === 0))
    ) {
      errors[field] = rule.requiredMessage || `${field} is required`;
      isValid = false;
    } else if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] =
        rule.minLengthMessage ||
        `${field} must be at least ${rule.minLength} characters`;
      isValid = false;
    } else if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] =
        rule.maxLengthMessage ||
        `${field} cannot exceed ${rule.maxLength} characters`;
      isValid = false;
    } else if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${field} format is invalid`;
      isValid = false;
    }
  });

  return { isValid, errors };
};
