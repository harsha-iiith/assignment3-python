import React from 'react';

const QuestionCard = ({ question, user, onStatusChange }) => {
  const cardColor = {
    unanswered: "#fffac8",
    answered: "#c8e6c9",
    important: "#ffcdd2",
  };

  return (
    <div className="question-card" style={{ backgroundColor: cardColor[question.status] }}>
      <p className="question-text">{question.text}</p>
      <p className="question-author">- {question.author.name}</p>

      {/* TEACHER CONTROLS */}
      {user.role === 'teacher' && (
        <div className="instructor-controls">
          <button onClick={() => onStatusChange(question._id, 'answered')}>Answered</button>
          <button onClick={() => onStatusChange(question._id, 'important')}>Important</button>
          <button onClick={() => onStatusChange(question._id, 'unanswered')}>Un-Answer</button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;