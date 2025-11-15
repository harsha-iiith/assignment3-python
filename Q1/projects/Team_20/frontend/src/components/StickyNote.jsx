import React from 'react';

const StickyNote = ({ question, index, userRole, onUpdateQuestion, onDeleteQuestion }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await onDeleteQuestion(question.id);
    }
  };
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMarkAnswered = async () => {
    const newStatus = question.status === 'Answered' ? 'Unanswered' : 'Answered';
    await onUpdateQuestion(question.id, { status: newStatus });
};

  const handleToggleImportant = async () => {
    await onUpdateQuestion(question.id, { isImportant: !question.isImportant });
  };

  const getStickyColor = (index) => {
    const colors = [
      'sticky-yellow',
      'sticky-blue', 
      'sticky-pink',
      'sticky-green',
      'sticky-purple',
      'sticky-orange'
    ];
    return colors[index % colors.length];
  };

  const getStickyStyle = () => {
    let backgroundColor = '#ffeb3b';
    
    if (question.status === 'Answered') {
      backgroundColor = '#4caf50';
    } else if (question.isImportant) {
      backgroundColor = '#ff9800';
    }

    return {
      backgroundColor,
      color: question.status === 'Answered' || question.isImportant ? 'white' : '#333'
    };
  };

  return (
    <div 
      className={`sticky-note ${getStickyColor(index)}`}
      style={getStickyStyle()}
    >
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>
          <span style={{ fontWeight: '600' }}>{question.author}</span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>{formatDate(question.createdAt)} at {formatTime(question.createdAt)}</span>
        </div>
        
        {userRole === 'teacher' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              onClick={handleMarkAnswered}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background 0.3s ease'
              }}
              title={question.status === 'Answered' ? 'Mark as unanswered' : 'Mark as answered'}
            >
              {question.status === 'Answered' ? '✅' : '⭕'}
            </button>
            <button
              onClick={handleToggleImportant}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background 0.3s ease'
              }}
              title={question.isImportant ? 'Remove from important' : 'Mark as important'}
            >
              {question.isImportant ? '⭐' : '☆'}
            </button>
            <button
              onClick={handleDelete}
              style={{
                background: 'rgba(255, 0, 0, 0.15)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#b71c1c',
                transition: 'background 0.3s ease'
              }}
              title="Delete question"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '14px', lineHeight: '1.4', margin: 0 }}>
          {question.text}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {question.status === 'Answered' && (
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            Answered
          </span>
        )}
        {question.isImportant && (
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            Important
          </span>
        )}
      </div>
    </div>
  );
};

export default StickyNote;
