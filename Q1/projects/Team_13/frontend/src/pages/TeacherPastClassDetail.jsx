import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassDoubts } from '../services/api';
import Header from '../components/Header';

const TeacherPastClassDetail = () => {
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
        // Get all doubts for this class (teachers can see all student doubts)
        const classDoubts = await getClassDoubts(classId);
        setDoubts(classDoubts);
      } catch (err) {
        setError('Failed to fetch doubts data');
        console.error('Error fetching doubts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, [classtopic, tid]);

  const getStableColor = (text) => {
    const colors = [
      '#FFFACD', // Light yellow
      '#FFE4E1', // Misty rose
      '#E0FFFF', // Light cyan
      '#F0FFF0', // Honeydew
      '#FFF8DC', // Cornsilk
      '#F5F5DC', // Beige
      '#E6E6FA', // Lavender
      '#FDF5E6', // Old lace
    ];
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredDoubts = doubts.filter(doubt => {
    if (filter === 'answered') return doubt.sstatus === 'answered';
    if (filter === 'unanswered') return doubt.sstatus === 'unanswered';
    return true;
  });

  const answeredCount = doubts.filter(doubt => doubt.sstatus === 'answered').length;
  const unansweredCount = doubts.length - answeredCount;

  if (loading) {
    return <div className="loading">Loading class doubts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header 
        title={`Past Class: ${decodeURIComponent(classtopic)}`}
        subtitle={`Teacher: ${tid} | Class History`}
        showBackButton={true}
        onBackClick={() => navigate('/teacher')}
        onLogout={handleLogout}
      />
      <div className="container">

      {/* Filter Controls */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Student Doubts (Read-Only)</h3>
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
          </div>
        </div>
      </div>

      {/* Doubts Display - List Format */}
      <div>
        {filteredDoubts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredDoubts.map((doubt, index) => (
              <div
                key={`${doubt.sid}-${doubt.timestamp}-${index}`}
                className="card"
                style={{
                  padding: '16px',
                  borderLeft: `4px solid ${doubt.sstatus === 'answered' ? '#10b981' : '#f59e0b'}`,
                  backgroundColor: doubt.sstatus === 'answered' ? '#f0fdf4' : '#fffbeb',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {doubt.sid}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: doubt.sstatus === 'answered' ? '#10b981' : '#f59e0b',
                      color: 'white'
                    }}>
                      {doubt.sstatus}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    {new Date(doubt.timestamp).toLocaleString()}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#4b5563',
                  marginLeft: '0px'
                }}>
                  {doubt.doubtasked}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            {filter === 'all' 
              ? 'No doubts were recorded for this class.' 
              : `No ${filter} doubts found.`
            }
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default TeacherPastClassDetail;
