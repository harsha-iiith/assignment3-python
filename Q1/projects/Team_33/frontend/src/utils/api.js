import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Class/Lecture API
export const classAPI = {
  createClass: (classData) => api.post('/classes', classData),
  joinClass: (code) => api.post('/classes/join', { code }),
};

// Questions API
export const questionAPI = {
  createQuestion: (questionData) => api.post('/questions', questionData),
  getQuestions: (classId) => api.get(`/questions/${classId}`),
  updateQuestionStatus: (questionId, status) => 
    api.patch(`/questions/${questionId}/status`, { status }),
};

export default api;
