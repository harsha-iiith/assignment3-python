import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ classData, userRole, onStudentClick }) => {
  const navigate = useNavigate();

const handleClick = () => {
    if (userRole === 'teacher') {
      // Teachers navigate directly to the classroom
      navigate(`/classroom/${classData.id}`);
    } else {
      // Students call the handler to prompt the access code modal on the dashboard
      onStudentClick(classData.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="class-card" onClick={handleClick}>
      <h3 className="class-title">{classData.title}</h3>
      
      <div className="class-meta">
        <p>Created: {formatDate(classData.createdAt || new Date())}</p>
        <p>Status: <span style={{ 
          color: classData.status === 'active' ? '#4caf50' : '#f44336',
          fontWeight: '600'
        }}>
          {classData.status || 'active'}
        </span></p>
      </div>

      {classData.accessCode && (
        <div style={{ marginTop: '15px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
            Access Code:
          </p>
          <div className="access-code">
            {classData.accessCode}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: '#f8f9fa', 
        borderRadius: '6px',
        fontSize: '14px',
        color: '#666'
      }}>
        {userRole === 'teacher' ? (
          <p>👨‍🏫 Your class - Click to manage questions</p>
        ) : (
          <p>🎓 Click to view and post questions</p>
        )}
      </div>
    </div>
  );
};

export default ClassCard;