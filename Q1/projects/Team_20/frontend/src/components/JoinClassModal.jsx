import React, { useState } from 'react';

const JoinClassModal = ({ onClose, onSubmit }) => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!accessCode.trim()) {
      setError('Please enter an access code');
      setLoading(false);
      return;
    }

    const result = await onSubmit(accessCode.trim());
    
    if (result.success) {
      setAccessCode('');
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
          Join Class
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Access Code</label>
            <input
              type="text"
              className="form-input"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter class access code"
              required
              disabled={loading}
            />
            <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Ask your instructor for the class access code
            </p>
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
              disabled={loading || !accessCode.trim()}
            >
              {loading ? 'Joining...' : 'Join Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClassModal;