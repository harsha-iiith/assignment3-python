// frontend/src/pages/ClassroomPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectCurrentUser } from '../features/authSlice';
import QuestionForm from '../components/QuestionForm';
import QuestionCard from '../components/QuestionCard';
import FilterControls from '../components/FilterControls'; // <-- Import new component

const ClassroomPage = () => {
  const { classId } = useParams();
  const user = useSelector(selectCurrentUser);
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState(''); // <-- New state for filtering
  const [error, setError] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const fetchQuestions = useCallback(async () => {
    if (user.role !== 'teacher') return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { status: filter || undefined }, // <-- Add filter to request
      };
      const { data } = await axios.get(`http://localhost:5000/api/questions/${classId}`, config);
      setQuestions(data);
    } catch (err) {
      setError('Failed to fetch questions. You may not have permission.');
    }
  }, [classId, user.token, user.role, filter]); // <-- Add filter to dependency array

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete all questions in this class? This cannot be undone.")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/questions/${classId}/clear`, config);
        fetchQuestions(); // Refresh the list
      } catch (err) {
        alert('Failed to clear questions.');
      }
    }
  };

  // --- (handleQuestionSubmit and handleStatusChange functions remain unchanged) ---

  // in frontend/src/pages/ClassroomPage.js

  const handleQuestionSubmit = async (text) => {
    setSubmissionMessage(''); // Clear previous success messages
    setError('');             // Clear previous error messages

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/questions/${classId}`, { text }, config);
      setSubmissionMessage('Your question has been submitted successfully!');
      if (user.role === 'teacher') {
        fetchQuestions();
      }
    } catch (err) {
      // Set the specific error message from the backend response
      setError(err.response?.data?.message || 'Failed to post question.');
    }
  };

  const handleStatusChange = async (questionId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(`http://localhost:5000/api/questions/${questionId}/status`, { status }, config);
      fetchQuestions();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="classroom-grid">
      <div className="classroom-main">
        <h2>Classroom Q&A</h2>
        {error && <p className="error-message">{error}</p>}
        {user.role === 'student' && (
          <>
            <QuestionForm onSubmit={handleQuestionSubmit} />
            {submissionMessage && <p className="success-message">{submissionMessage}</p>}
          </>
        )}
        {user.role === 'teacher' && (
          <div className="question-board">
            {questions.length > 0 ? (
              questions.map((q) => (
                <QuestionCard
                  key={q._id}
                  question={q}
                  user={user}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <p>No questions match the current filter.</p>
            )}
          </div>
        )}
      </div>
      {user.role === 'teacher' && (
        <aside className="classroom-sidebar">
          <FilterControls setFilter={setFilter} onClear={handleClearAll} />
        </aside>
      )}
    </div>
    
  );
};

export default ClassroomPage;