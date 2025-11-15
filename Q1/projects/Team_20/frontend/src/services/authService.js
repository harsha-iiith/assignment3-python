import api from './api';

export const authService = {
  // Student registration
  registerStudent: async (userData) => {
    try {
      const response = await api.post('/student/register', {
        Name: userData.name,
        email: userData.email,
        Roll_Number: userData.rollNumber,
        password: userData.password
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Teacher registration
  registerTeacher: async (userData) => {
    try {
      const response = await api.post('/teacher/register', {
        Name: userData.name,
        email: userData.email,
        password: userData.password
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Student login
  loginStudent: async (credentials) => {
    try {
      const response = await api.post('/student/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          id: data.user._id,
          name: data.user.Name,
          email: data.user.email,
          role: data.userRole,
          token: data.accessToken
        },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Teacher login
  loginTeacher: async (credentials) => {
    try {
      const response = await api.post('/teacher/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { data } = response.data;
      
      return {
        success: true,
        data: {
          id: data.user._id,
          name: data.user.Name,
          email: data.user.email,
          role: data.userRole,
          token: data.accessToken
        },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Student logout
  logoutStudent: async () => {
    try {
      await api.post('/student/logout');
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  },

  // Teacher logout
  logoutTeacher: async () => {
    try {
      await api.post('/teacher/logout');
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  },

};
