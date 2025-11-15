// src/services/taApi.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get TA info by taid from teachingassistant table
export const getTAInfo = async (taid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ta/${taid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TA info:', error);
    throw error;
  }
};

// Get ALL classes for a specific teacher ID (for TA dashboard)
export const getTeacherClasses = async (tid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classes/teacher/${tid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    throw error;
  }
};

// Get ALL doubts - keeping this for backward compatibility
export const getAllDoubts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doubts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doubts:', error);
    throw error;
  }
};

// Get questions for a specific class - filtering doubts
export const getClassQuestions = async (classtopic, tid) => {
  try {
    const doubts = await getAllDoubts();
    const questions = doubts.filter(doubt => 
      doubt.classtopic === classtopic && doubt.tid === tid
    );
    return questions;
  } catch (error) {
    console.error('Error fetching class questions:', error);
    throw error;
  }
};

export const updateQuestionStatus = (questionId, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In real implementation, this would update the backend
      console.log(`Question ${questionId} status updated to ${status}`);
      resolve({ success: true, questionId, status });
    }, 200);
  });
};
