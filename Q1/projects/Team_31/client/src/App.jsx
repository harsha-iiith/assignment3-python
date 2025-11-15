import React, { useState, useEffect, useMemo } from 'react';
import QuestionBoard from './components/QuestionBoard';
import QuestionForm from './components/QuestionForm';
import FilterToolbar from './components/FilterToolbar';
import { fetchQuestions, clearBoard } from './services/api';
import socket from './services/socket';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  //  Read the initial state from localStorage
  const [isArchiveVisible, setArchiveVisible] = useState(() => {
    return localStorage.getItem('isArchiveVisible') === 'true';
  });

  //  Save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isArchiveVisible', isArchiveVisible);
  }, [isArchiveVisible]);


  useEffect(() => {
    // This function fetches data based on the current view (live or archive)
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchQuestions({ isArchived: isArchiveVisible });
        setQuestions(fetchedData.data || []);
      } catch (err) {
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [isArchiveVisible]); // Re-fetch when the archive view is toggled

  useEffect(() => {
    // Socket listeners only affect the live board
    socket.on('newQuestion', (newQuestion) => {
      if (!isArchiveVisible) {
        setQuestions(prev => [newQuestion, ...prev]);
      }
    });
    socket.on('questionUpdated', (updatedQuestion) => {
      if (!isArchiveVisible) {
        setQuestions(prev => prev.map(q => q._id === updatedQuestion._id ? updatedQuestion : q));
      }
    });
    socket.on('boardCleared', () => {
      if (!isArchiveVisible) {
        setQuestions([]);
      }
    });

    return () => {
      socket.off('newQuestion');
      socket.off('questionUpdated');
      socket.off('boardCleared');
    };
  }, [isArchiveVisible]); // Re-attach listeners if archive view changes

  const handleClearBoard = async () => {
    if (window.confirm('Are you sure you want to clear the board? This will archive all questions.')) {
      try {
        await clearBoard();
      } catch (error) {
        alert('Failed to clear the board.');
      }
    }
  };

  const handleToggleArchive = () => {
    setArchiveVisible(prev => !prev);
  };

  const filteredQuestions = useMemo(() => {
    if (isArchiveVisible) return questions; // Don't filter the archive view
    if (activeFilter === 'unanswered') {
      return questions.filter(q => q.status === 'unanswered');
    }
    if (activeFilter === 'important') {
      return questions.filter(q => q.isImportant);
    }
    return questions; // 'all'
  }, [questions, activeFilter, isArchiveVisible]);

  return (
    <div className="app-container">
      <h1>{isArchiveVisible ? 'Archived Questions' : 'VidyaVichar Board'}</h1>
      <QuestionForm isArchiveVisible={isArchiveVisible} />
      <FilterToolbar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onClearBoard={handleClearBoard}
        onToggleArchive={handleToggleArchive}
        isArchiveVisible={isArchiveVisible}
      />
      <QuestionBoard
        questions={filteredQuestions}
        loading={loading}
        error={error}
        isArchiveVisible={isArchiveVisible}
      />
    </div>
  );
}

export default App;