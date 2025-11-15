import { get, post, put, del } from "./api";

/**
 * Course service - handles all course-related API calls
 */

/**
 * Get all courses
 * @returns {Promise} - API response with courses array
 */
export const getCourses = () => {
  return get("/courses");
};

/**
 * Get a specific course by ID
 * @param {string} courseId - Course ID
 * @returns {Promise} - API response with course data
 */
export const getCourse = (courseId) => {
  return get(`/courses/${courseId}`);
};

/**
 * Create a new course
 * @param {object} courseData - Course information
 * @param {string} courseData.title - Course title
 * @param {string} courseData.code - Course code
 * @param {string} courseData.instructor - Instructor name
 * @param {string} courseData.description - Course description (optional)
 * @returns {Promise} - API response with created course
 */
export const createCourse = (courseData) => {
  return post("/courses", courseData);
};

/**
 * Update an existing course
 * @param {string} courseId - Course ID
 * @param {object} courseData - Updated course information
 * @returns {Promise} - API response with updated course
 */
export const updateCourse = (courseId, courseData) => {
  return put(`/courses/${courseId}`, courseData);
};

/**
 * Delete a course
 * @param {string} courseId - Course ID
 * @returns {Promise} - API response
 */
export const deleteCourse = (courseId) => {
  return del(`/courses/${courseId}`);
};
