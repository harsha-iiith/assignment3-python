import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassDoubts } from '../services/api';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const PastClass = () => {
  const { classtopic } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    // TODO: Replace with actual logout logic when backend is ready
    console.log('Logout clicked - ready for backend integration');
    alert('Logout functionality ready for backend integration!');
  };

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        setLoading(true);
        const classId = decodeURIComponent(classtopic);
        const data = await getClassDoubts(classId, { 
          studentId: user?.email || user?.roll_no 
        });
        setDoubts(data);
      } catch (err) {
        setError('Failed to fetch doubts data');
        console.error('Error fetching doubts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDoubts();
    }
  }, [classtopic, user]);

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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading class doubts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header 
        title={decodeURIComponent(classtopic)}
        subtitle="View your past doubts and questions"
        showBackButton={true}
        onBackClick={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div className="container">

      <div>
        <h3 style={{ 
          marginBottom: '20px', 
          color: '#1f2937',
          fontSize: '20px'
        }}>
          Your Doubts ({doubts.length})
        </h3>
        
        {doubts.length > 0 ? (
          <div>
            {doubts.map((doubt, index) => (
              <div
                key={index}
                className={`sticky-note ${doubt.sstatus}`}
                style={{ 
                  backgroundColor: getStableColor(doubt.doubtasked),
                  transform: 'rotate(0deg)'
                }}
              >
                <div className={`status-badge ${doubt.sstatus}`}>
                  {doubt.sstatus}
                </div>
                <p style={{ 
                  marginBottom: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {doubt.doubtasked}
                </p>
                <p style={{ 
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Posted on {formatTimestamp(doubt.timestamp)}
                </p>
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
            No doubts found for this class.
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default PastClass;
