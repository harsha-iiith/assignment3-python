// src/services/api.js
import axios from 'axios';
import { mockDoubts } from './mockData';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Doubts API services
export const getAllDoubts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.studentId) params.append('studentId', filters.studentId);
    if (filters.teacherId) params.append('teacherId', filters.teacherId);
    if (filters.status) params.append('status', filters.status);
    
    const response = await axios.get(`${API_BASE_URL}/api/doubts?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doubts:', error);
    // Fallback to mock data if API fails
    return mockDoubts;
  }
};

export const postDoubt = async (doubtData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/doubts`, doubtData);
    return response.data;
  } catch (error) {
    console.error('Error posting doubt:', error);
    throw error;
  }
};

export const updateDoubtStatus = async (doubtId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/doubts/${doubtId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating doubt status:', error);
    throw error;
  }
};

export const getClassDoubts = async (classId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.studentId) params.append('studentId', filters.studentId);
    if (filters.status) params.append('status', filters.status);
    
    const response = await axios.get(`${API_BASE_URL}/api/classes/${encodeURIComponent(classId)}/doubts?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class doubts:', error);
    throw error;
  }
};

export const getStudentDoubts = async (studentId, classId = null) => {
  try {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    
    const response = await axios.get(`${API_BASE_URL}/api/students/${studentId}/doubts?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student doubts:', error);
    throw error;
  }
};

export const getTeacherDoubts = async (teacherId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.status) params.append('status', filters.status);
    
    const response = await axios.get(`${API_BASE_URL}/api/teachers/${teacherId}/doubts?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher doubts:', error);
    throw error;
  }
};
