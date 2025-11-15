import { useState } from 'react';
import './Modal.css';

const CreateClassModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', code: '' });
    } catch (error) {
      console.error('Error creating class:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Class</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Class Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Advanced Programming"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="code">Class Code:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., CS101"
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
              disabled={loading || !formData.title || !formData.code}
              className="button-primary"
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
