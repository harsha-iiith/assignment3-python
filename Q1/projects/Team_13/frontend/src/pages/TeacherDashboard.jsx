import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDoubts } from '../services/api';
import ClassCard from '../components/ClassCard';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('live');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const handleLogout = () => {
    console.log('Teacher Logout clicked - ready for backend integration');
    alert('Teacher Logout functionality ready for backend integration!');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both doubts and classes
        const [doubtsData, classesData] = await Promise.all([
          getAllDoubts(),
          fetchTeacherClasses()
        ]);
        
        setDoubts([...doubtsData, ...classesData]);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTeacherClasses = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_BASE_URL}/api/classes?tid=${user.email}`);
      
      // Convert classes to doubt-like format for display
      return response.data.map(cls => ({
        classtopic: cls.classId,
        tid: cls.tid,
        timestamp: cls.createdAt,
        sid: 'system',
        doubtasked: 'Class created',
        sstatus: 'answered',
        active: cls.active // Include active status from database
      }));
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  };

  // Create unique classes from doubts data - filter by teacher ID
  const getUniqueClasses = () => {
    const classMap = new Map();
    
    doubts.forEach(doubt => {
      const key = `${doubt.classtopic}-${doubt.tid}`;
      if (!classMap.has(key) && doubt.tid === user.email) { // Filter by current teacher
        classMap.set(key, {
          classtopic: doubt.classtopic,
          tid: doubt.tid,
          timestamp: doubt.timestamp
        });
      }
    });
    
    return Array.from(classMap.values());
  };

  // Separate classes into live and past
  const separateClasses = () => {
    const classes = getUniqueClasses();
    
    // Filter classes based on active status from database
    const liveClasses = classes.filter(cls => {
      // Check if this class has active status from database
      const classFromDB = doubts.find(d => 
        d.classtopic === cls.classtopic && 
        d.tid === cls.tid && 
        d.hasOwnProperty('active')
      );
      
      // If found in DB, use active status; otherwise assume it's active if created today
      if (classFromDB) {
        return classFromDB.active === true;
      } else {
        // Fallback to date-based logic for mock data
        const today = new Date().toDateString();
        const classDate = new Date(cls.timestamp).toDateString();
        return classDate === today;
      }
    });
    
    const pastClasses = classes.filter(cls => {
      // Check if this class has active status from database
      const classFromDB = doubts.find(d => 
        d.classtopic === cls.classtopic && 
        d.tid === cls.tid && 
        d.hasOwnProperty('active')
      );
      
      // If found in DB, use active status; otherwise assume it's past if not today
      if (classFromDB) {
        return classFromDB.active === false;
      } else {
        // Fallback to date-based logic for mock data
        const today = new Date().toDateString();
        const classDate = new Date(cls.timestamp).toDateString();
        return classDate !== today;
      }
    });
    
    return { liveClasses, pastClasses };
  };

  const handleCreateClass = async () => {
    if (newClassName.trim()) {
      try {
        const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        
        const response = await axios.post(`${API_BASE_URL}/api/classes`, {
          classId: newClassName.trim(),
          tid: user.email, // Use the logged-in teacher's email/ID
          active: true
        });
        if (response.data.success) {
          // Add to local state for immediate UI update
          const newClass = {
            classtopic: newClassName.trim(),
            tid: user.email,
            timestamp: new Date().toISOString(),
            sid: 'system',
            doubtasked: 'Class created',
            sstatus: 'answered',
            active: true // New classes are active by default
          };
          
          setDoubts(prev => [...prev, newClass]);
          setNewClassName('');
          setShowCreateClass(false);
        }
      } catch (error) {
        console.error('Error creating class:', error);
        alert('Failed to create class. Please try again.');
      }
    }
  };

  const { liveClasses, pastClasses } = separateClasses();

  if (loading) {
    return <div className="loading">Loading your classes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header 
        title="VidyaVichar - Teacher Dashboard" 
        // subtitle="Welcome back, Teacher Alpha! Manage your classes and student doubts."
        onLogout={handleLogout}
      />
      <div className="container">

      {/* Create New Class Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Class Management</h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateClass(!showCreateClass)}
          >
            {showCreateClass ? 'Cancel' : 'Create New Class'}
          </button>
        </div>
        
        {showCreateClass && (
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            marginTop: '15px'
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              color: '#1f2937',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Create New Class
            </h4>
            <p style={{ 
              margin: '0 0 20px 0', 
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Enter a descriptive topic for your new class. Students will see this when joining.
            </p>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Class Topic *
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g., Advanced React Patterns, Data Structures, Machine Learning..."
                  style={{ 
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateClass(false);
                    setNewClassName('');
                  }}
                  style={{ 
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateClass}
                  disabled={!newClassName.trim()}
                  style={{ 
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: !newClassName.trim() ? '0.5' : '1'
                  }}
                >
                  Create Class
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live Classes ({liveClasses.length})
        </button>
        <button 
          className={`tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Classes ({pastClasses.length})
        </button>
      </div>

      <div className="grid">
        {activeTab === 'live' ? (
          liveClasses.length > 0 ? (
            liveClasses.map((cls, index) => (
              <ClassCard
                key={`live-${index}`}
                classtopic={cls.classtopic}
                tid={cls.tid}
                date={cls.timestamp}
                isLive={true}
                isTeacher={true}
              />
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: '#6b7280'
            }}>
              No live classes available. Create a new class to get started!
            </div>
          )
        ) : (
          pastClasses.length > 0 ? (
            pastClasses.map((cls, index) => {
              // Get doubts for this class
              const classDoubts = doubts.filter(doubt => 
                doubt.classtopic === cls.classtopic && doubt.tid === cls.tid
              );
              const answeredCount = classDoubts.filter(doubt => doubt.sstatus === 'answered').length;
              const unansweredCount = classDoubts.length - answeredCount;

              return (
                <div key={`past-${index}`} className="card">
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      {cls.classtopic}
                    </h3>
                    
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '14px',
                      marginBottom: '5px'
                    }}>
                      Teacher ID: {cls.tid}
                    </p>
                    
                    <p style={{ 
                      color: '#9ca3af', 
                      fontSize: '12px',
                      marginBottom: '15px'
                    }}>
                      {new Date(cls.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
                          {classDoubts.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                          {answeredCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Answered</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '20px', 
                          fontWeight: '700', 
                          color: unansweredCount > 0 ? '#ef4444' : '#6b7280'
                        }}>
                          {unansweredCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Pending</div>
                      </div> */}
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/teacher/past-class/${encodeURIComponent(cls.classtopic)}/${cls.tid}`)}
                    style={{ width: '100%' }}
                  >
                    View Doubts
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: '#6b7280'
            }}>
              No past classes available.
            </div>
          )
        )}
      </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
