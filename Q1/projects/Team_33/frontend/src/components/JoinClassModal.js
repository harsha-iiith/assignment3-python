import { useState } from 'react';
import './Modal.css';

const JoinClassModal = ({ isOpen, onClose, onSubmit }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(code.trim());
      setCode('');
    } catch (error) {
      console.error('Error joining class:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Join Class</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="code">Class Code:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter class code"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="button-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !code.trim()}
              className="button-primary"
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
