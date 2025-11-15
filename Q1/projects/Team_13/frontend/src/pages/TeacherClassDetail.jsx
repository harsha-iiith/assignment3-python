import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassDoubts, updateDoubtStatus } from '../services/api';
import Header from '../components/Header';
import axios from 'axios';

const TeacherClassDetail = () => {
  const { classtopic, tid } = useParams();
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unanswered', 'answered'

  const handleLogout = () => {
    console.log('Teacher Logout clicked - ready for backend integration');
    alert('Teacher Logout functionality ready for backend integration!');
  };

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        setLoading(true);
        const classId = decodeURIComponent(classtopic);
        const data = await getClassDoubts(classId);
        setDoubts(data);
      } catch (err) {
        setError('Failed to fetch doubts data');
        console.error('Error fetching doubts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
    
    // Set up polling for real-time updates every 5 seconds
    const interval = setInterval(fetchDoubts, 5000);
    
    return () => clearInterval(interval);
  }, [classtopic, tid]);

  const handleMarkAsAnswered = async (doubt) => {
    try {
      await updateDoubtStatus(doubt._id, 'answered');
      // Update local state
      setDoubts(prev => prev.map(d => 
        d._id === doubt._id ? { ...d, sstatus: 'answered' } : d
      ));
    } catch (error) {
      console.error('Error updating doubt status:', error);
      alert('Failed to update doubt status. Please try again.');
    }
  };

  const handleEndClass = async () => {
    try {
      // Find the class ID from the database to end it
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      
      // First get the class by classId and tid to find the MongoDB _id
      const classesResponse = await axios.get(`${API_BASE_URL}/api/classes?tid=${tid}`);
      const currentClass = classesResponse.data.find(cls => 
        cls.classId === decodeURIComponent(classtopic)
      );
      
      if (currentClass) {
        // End the class by setting active to false
        const endResponse = await axios.put(`${API_BASE_URL}/api/classes/${currentClass._id}/end`);
        
        if (endResponse.data.success) {
          console.log('Class ended successfully');
          // Navigate back to teacher dashboard
          navigate('/teacher');
        }
      } else {
        console.error('Class not found');
        navigate('/teacher');
      }
    } catch (error) {
      console.error('Error ending class:', error);
      // Still navigate back even if there's an error
      navigate('/teacher');
    }
  };

  const getStableColor = (text) => {
    const colors = [
      '#FFFACD', // Light yellow
      '#FFE4E1', // Misty rose
      '#E0FFFF', // Light cyan
      '#F0FFF0', // Honeydew
      '#FFF8DC', // Cornsilk
      '#F5FFFA', // Mint cream
      '#FFEFD5', // Papaya whip
      '#F0F8FF', // Alice blue
      '#E6E6FA', // Lavender
      '#F5F5DC', // Beige
    ];
    // Use text hash to get consistent color
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredDoubts = () => {
    let filtered = [...doubts];
    
    if (filter === 'unanswered') {
      filtered = filtered.filter(doubt => doubt.sstatus === 'unanswered');
    } else if (filter === 'answered') {
      filtered = filtered.filter(doubt => doubt.sstatus === 'answered');
    }

    // Sort: unanswered first, then by timestamp (newest first)
    return filtered.sort((a, b) => {
      if (a.sstatus !== b.sstatus) {
        return a.sstatus === 'unanswered' ? -1 : 1;
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  };

  const filteredDoubts = getFilteredDoubts();
  const unansweredCount = doubts.filter(d => d.sstatus === 'unanswered').length;
  const answeredCount = doubts.filter(d => d.sstatus === 'answered').length;

  if (loading) {
    return <div className="loading">Loading class doubts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header 
        title={`${decodeURIComponent(classtopic)} - Teacher View`}
        subtitle={`Manage student doubts and questions (${doubts.length} total doubts)`}
        showBackButton={true}
        onBackClick={() => navigate('/teacher')}
        onLogout={handleLogout}
      />
      <div className="container">

      {/* Filter Controls */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Student Doubts</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('all')}
                style={{ padding: '6px 12px', fontSize: '14px' }}
              >
                All ({doubts.length})
              </button>
              <button 
                className={`btn ${filter === 'unanswered' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('unanswered')}
                style={{ padding: '6px 12px', fontSize: '14px' }}
              >
                Unanswered ({unansweredCount})
              </button>
              <button 
                className={`btn ${filter === 'answered' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('answered')}
                style={{ padding: '6px 12px', fontSize: '14px' }}
              >
                Answered ({answeredCount})
              </button>
            </div>
            <button 
              className="btn"
              onClick={handleEndClass}
              style={{ 
                padding: '8px 16px', 
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#dc2626',
                color: 'white',
                border: '2px solid #dc2626',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#b91c1c';
                e.target.style.borderColor = '#b91c1c';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.borderColor = '#dc2626';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              End Class
            </button>
          </div>
        </div>
      </div>

      {/* Doubts Display */}
      <div>
        {filteredDoubts.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            padding: '20px 0'
          }}>
            {filteredDoubts.map((doubt, index) => (
              <div
                key={`${doubt.sid}-${doubt.timestamp}-${index}`}
                className={`sticky-note ${doubt.sstatus}`}
                style={{ 
                  backgroundColor: getStableColor(doubt.doubtasked),
                  position: 'relative',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div className={`status-badge ${doubt.sstatus}`}>
                    {doubt.sstatus}
                  </div>
                  <p style={{ 
                    marginBottom: '15px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    fontWeight: '500'
                  }}>
                    {doubt.doubtasked}
                  </p>
                  <p style={{ 
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '15px'
                  }}>
                    <strong>Student:</strong> {doubt.sid}<br/>
                    <strong>Asked:</strong> {formatTimestamp(doubt.timestamp)}
                  </p>
                </div>
                
                {doubt.sstatus === 'unanswered' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleMarkAsAnswered(doubt)}
                    style={{ 
                      padding: '6px 12px',
                      fontSize: '12px',
                      alignSelf: 'flex-start',
                      marginTop: 'auto'
                    }}
                  >
                    Mark as Answered
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {filter === 'all' && 'No doubts posted in this class yet.'}
            {filter === 'unanswered' && 'No unanswered doubts! Great job!'}
            {filter === 'answered' && 'No answered doubts yet.'}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default TeacherClassDetail;
