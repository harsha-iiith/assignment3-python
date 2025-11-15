import React, { useState } from 'react';

const CreateClassModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title.trim()) {
      setError('Please enter a class title');
      setLoading(false);
      return;
    }

    const result = await onSubmit({ title: title.trim() });
    
    if (result.success) {
      setTitle('');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          Create New Class
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Class Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter class title"
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading || !title.trim()}
            >
              {loading ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;
