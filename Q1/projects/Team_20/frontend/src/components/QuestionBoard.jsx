import React from 'react';
import StickyNote from './StickyNote';

const QuestionBoard = ({ questions, userRole, onUpdateQuestion, onDeleteQuestion }) => {
  if (questions.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        color: '#666',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
        <h3 style={{ marginBottom: '10px', color: '#333' }}>No Questions Yet</h3>
        <p>
          {userRole === 'student' 
            ? 'Be the first to ask a question!' 
            : 'Questions from students will appear here as sticky notes.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="board-grid">
      {questions.map((question, index) => (
        <StickyNote
          key={question.id}
          question={question}
          index={index}
          userRole={userRole}
          onUpdateQuestion={onUpdateQuestion}
          onDeleteQuestion={onDeleteQuestion}
        />
      ))}
    </div>
  );
};

export default QuestionBoard;
