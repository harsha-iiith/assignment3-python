import React, { useState } from 'react';

const QuestionForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!text.trim()) {
      setError('Please enter a question');
      setLoading(false);
      return;
    }

    const result = await onSubmit({ text: text.trim() });
    
    if (result.success) {
      setText('');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>
        Ask a Question
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Your Question</label>
          <textarea
            className="form-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your question here..."
            rows="3"
            required
            disabled={loading}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Posting...' : '📝 Post Question'}
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
