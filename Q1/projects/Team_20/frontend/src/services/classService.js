import api from './api';

export const classService = {
  // Create a new class (teacher only)
  createClass: async (classData) => {
    try {
      const response = await api.post('/teacher/createClass', {
        title: classData.title
      });
      
      return {
        success: true,
        data: {
          id: response.data.data._id,
          title: response.data.data.title || 'Untitled Class',
          accessCode: response.data.data.accessCode,
          teacher: response.data.data.teacher,
          status: response.data.data.status,
          createdAt: response.data.data.createdAt
        },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create class'
      };
    }
  },

  // Get all active classes (for students to see and join)
  getActiveClasses: async () => {
    try {
      const response = await api.get('/student/getAllActiveClasses');
      
      return {
        success: true,
        data: response.data.data.map(cls => ({
          id: cls._id,
          title: cls.title || 'Untitled Class',
          accessCode: cls.accessCode,
          teacher: cls.teacher,
          status: cls.status,
          createdAt: cls.createdAt
        }))
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch classes',
        data: []
      };
    }
  },



getTeacherClasses: async () => {
    try {
      // Use the actual backend API route
      const response = await api.get('/teacher/getTeacherClasses');
      
      return {
        success: true,
        data: response.data.data.map(cls => ({
          // Map fields from the backend response
          id: cls._id,
          title: cls.title || 'Untitled Class',
          accessCode: cls.accessCode, 
          teacher: cls.teacher,
          status: cls.status,
          createdAt: cls.createdAt
        }))
      };
    } catch (error) {
      // If the API call fails, handle the error gracefully
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch teacher classes from API',
        data: []
      };
    }
  },

  // Mock function for students to join a class (backend doesn't have this API)
  joinClass: async (classId, accessCode) => {
    try {
      // Send classId and accessCode to the backend endpoint
      const response = await api.post('/student/joinClass', {
        classId: classId,
        accessCode: accessCode
      });
      
      // The backend updates activeClass in DB and sends a success message
      return {
        success: true,
        // Backend returns {} for data, but success means the DB was updated
        data: response.data.data, 
        message: response.data.message
      };
    } catch (error) {
      // Capture specific error message (e.g., "AccessCode is not correct")
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to join/access class'
      };
    }
  },
  // Get class by ID (mock function)
  getClassById: async (classId) => {
    try {
      return {
        success: true,
        data: {
          id: classId,
          title: 'Class',
          accessCode: 'ABC123',
          status: 'active'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch class details'
      };
    }
  },

  // End a class (teacher only)
  endClass: async (classId) => {
    try {
      const response = await api.post('/teacher/endClass', { classId });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to end class'
      };
    }
  }
};
