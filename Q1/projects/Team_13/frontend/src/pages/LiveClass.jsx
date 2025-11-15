import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassDoubts, postDoubt } from '../services/api';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const LiveClass = () => {
  const { classtopic, tid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDoubt, setNewDoubt] = useState('');
  const [posting, setPosting] = useState(false);

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

  const handlePostDoubt = async () => {
    if (newDoubt.trim() && !posting) {
      try {
        setPosting(true);
        const doubtData = {
          classId: decodeURIComponent(classtopic),
          studentId: user?.email || user?.roll_no,
          teacherId: tid || "teacher_alpha", // Use tid from URL params or fallback
          doubtText: newDoubt.trim()
        };
        
        const response = await postDoubt(doubtData);
        
        if (response.success) {
          // Add the new doubt to the local state for immediate UI update
          setDoubts(prev => [response.doubt, ...prev]);
          setNewDoubt('');
        }
      } catch (err) {
        console.error('Error posting doubt:', err);
        alert('Failed to post doubt. Please try again.');
      } finally {
        setPosting(false);
      }
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
    return date.toLocaleTimeString('en-US', {
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
        subtitle="Ask your questions and view your doubts"
        showBackButton={true}
        onBackClick={() => navigate('/')}
        onLogout={handleLogout}
      />
      <div className="container">

      <div className="card">
        <h3 style={{ marginBottom: '15px', color: '#1f2937' }}>Post a New Doubt</h3>
        <textarea
          className="textarea"
          value={newDoubt}
          onChange={(e) => setNewDoubt(e.target.value)}
          placeholder="Type your question here..."
        />
        <button 
          className="btn btn-primary"
          onClick={handlePostDoubt}
          style={{ marginTop: '10px' }}
          disabled={!newDoubt.trim() || posting}
        >
          {posting ? 'Posting...' : 'Post Doubt'}
        </button>
      </div>

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
                  Posted at {formatTimestamp(doubt.timestamp)}
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
            No doubts posted yet. Ask your first question above!
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default LiveClass;
