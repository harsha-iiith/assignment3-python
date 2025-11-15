import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClassSummaryCard = ({ classData }) => {
  const navigate = useNavigate();

  const handleViewQuestions = () => {
    // Navigate using classtopic and tid
    navigate(`/ta/class/${encodeURIComponent(classData.classtopic)}/${classData.tid}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (classData.unansweredQuestions === 0) return '#10b981'; // green
    if (classData.unansweredQuestions <= 2) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          {classData.classtopic}
        </h3>
        
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px',
          marginBottom: '5px'
        }}>
          Teacher ID: {classData.tid}
        </p>
        
        <p style={{ 
          color: '#9ca3af', 
          fontSize: '12px',
          marginBottom: '15px'
        }}>
          {formatDate(classData.timestamp)}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          marginBottom: '10px'
        }}>
          {/* <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
              {classData.totalQuestions}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
              {classData.answeredQuestions}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Answered</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: classData.unansweredQuestions > 0 ? '#ef4444' : '#6b7280'
            }}>
              {classData.unansweredQuestions}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Pending</div>
          </div> */}
        </div>
      </div>
      
      <button 
        className="btn btn-primary"
        onClick={handleViewQuestions}
        style={{ width: '100%' }}
      >
        View Doubts
      </button>
    </div>
  );
};

export default ClassSummaryCard;
