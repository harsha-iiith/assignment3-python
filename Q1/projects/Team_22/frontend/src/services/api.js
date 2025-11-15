import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding common headers
api.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists (for future authentication)
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login (for future authentication)
          localStorage.removeItem("authToken");
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden:", data.message);
          break;
        case 404:
          // Not found
          console.error("Resource not found:", data.message);
          break;
        case 429:
          // Too many requests
          console.error("Rate limit exceeded:", data.message);
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error(
            "Server error:",
            data.message || "Internal server error"
          );
          break;
        default:
          console.error("API error:", data.message || "Unknown error");
      }

      // Return standardized error format
      return Promise.reject({
        status,
        message: data.message || "An error occurred",
        errors: data.errors || [],
        isNetworkError: false,
      });
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error:", error.message);
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
        errors: [],
        isNetworkError: true,
      });
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
      return Promise.reject({
        status: 0,
        message: "Request failed. Please try again.",
        errors: [],
        isNetworkError: false,
      });
    }
  }
);

/**
 * Generic API call wrapper
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint
 * @param {object} data - Request data (for POST/PUT)
 * @param {object} config - Additional axios config
 * @returns {Promise} - API response promise
 */

export const apiCall = async (method, url, data, config = {}) => {
  const options = { method, url, ...config };
  if (data !== undefined) {
    options.data = data;
  }

  try {
    const response = await api(options);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message,
      errors: error.errors || [],
      status: error.status,
      isNetworkError: error.isNetworkError,
    };
  }
};


// export const apiCall = async (method, url, data = null, config = {}) => {
//   try {
//     const response = await api({
//       method,
//       url,
//       data,
//       ...config,
//     });

//     return {
//       success: true,
//       data: response.data.data || response.data,
//       message: response.data.message,
//       status: response.status,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       data: null,
//       message: error.message,
//       errors: error.errors || [],
//       status: error.status,
//       isNetworkError: error.isNetworkError,
//     };
//   }
// };

/**
 * GET request wrapper
 * @param {string} url - API endpoint
 * @param {object} config - Additional axios config
 * @returns {Promise} - API response promise
 */
export const get = (url, config = {}) => apiCall("GET", url, null, config);

/**
 * POST request wrapper
 * @param {string} url - API endpoint
 * @param {object} data - Request data
 * @param {object} config - Additional axios config
 * @returns {Promise} - API response promise
 */
export const post = (url, data, config = {}) =>
  apiCall("POST", url, data, config);

/**
 * PUT request wrapper
 * @param {string} url - API endpoint
 * @param {object} data - Request data
 * @param {object} config - Additional axios config
 * @returns {Promise} - API response promise
 */
export const put = (url, data, config = {}) =>
  apiCall("PUT", url, data, config);

/**
 * DELETE request wrapper
 * @param {string} url - API endpoint
 * @param {object} config - Additional axios config
 * @returns {Promise} - API response promise
 */
// export const del = (url, config = {}) => apiCall("DELETE", url, null, config);
export const del = (url, config = {}) => apiCall("DELETE", url, undefined, config);

/**
 * Health check endpoint
 * @returns {Promise} - Health check response
 */
export const healthCheck = () => get("/health");

export default api;
