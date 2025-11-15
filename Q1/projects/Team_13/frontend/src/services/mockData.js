// src/services/mockData.js

// Minimal mock doubts data used across student/TA/teacher flows
export const mockDoubts = [
  {
    id: 'q1',
    classtopic: 'Mathematics',
    tid: 'T001',
    question: 'What is the difference between permutation and combination?',
    author: 'S101',
    status: 'unanswered',
    timestamp: new Date().toISOString()
  },
  {
    id: 'q2',
    classtopic: 'Physics',
    tid: 'T002',
    question: 'Explain conservation of momentum with examples.',
    author: 'S102',
    status: 'answered',
    timestamp: new Date(Date.now() - 86400000).toISOString() // yesterday
  },
  {
    id: 'q3',
    classtopic: 'Mathematics',
    tid: 'T001',
    question: 'When to use chain rule vs product rule?',
    author: 'S103',
    status: 'unanswered',
    timestamp: new Date().toISOString()
  }
];
