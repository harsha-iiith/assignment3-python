import React, { useState, useEffect } from 'react';
import ClassCard from '../components/ClassCard';
import Header from '../components/Header';
import axios from 'axios';

const StudentDashboard = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('live');

  const handleLogout = () => {
    // TODO: Replace with actual logout logic when backend is ready
    // This could be:
    // - Clear localStorage/sessionStorage
    // - Call logout API endpoint
    // - Redirect to login page
    console.log('Logout clicked - ready for backend integration');
    alert('Logout functionality ready for backend integration!');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both active classes and student past classes
        const [activeClassesData, pastClassesData] = await Promise.all([
          fetchActiveClasses(),
          fetchStudentPastClasses()
        ]);
        
        setLiveClasses(activeClassesData);
        setPastClasses(pastClassesData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchActiveClasses = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_BASE_URL}/api/classes/active`);
      
      // Convert active classes to proper format for display
      return response.data.map(cls => ({
        _id: cls._id,
        classtopic: cls.classId,
        tid: cls.tid,
        timestamp: cls.createdAt,
        active: cls.active,
        isLiveClass: true
      }));
    } catch (error) {
      console.error('Error fetching active classes:', error);
      return [];
    }
  };

  const fetchStudentPastClasses = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const studentId = 'student_101'; // Mock student ID - in real app, get from auth context
      
      const response = await axios.get(`${API_BASE_URL}/api/students/${studentId}/past-classes`);
      
      // Convert past classes to proper format for display
      return response.data.map(cls => ({
        _id: cls._id,
        classtopic: cls.className,
        tid: cls.teacherId,
        timestamp: cls.completedAt,
        active: false,
        isLiveClass: false
      }));
    } catch (error) {
      console.error('Error fetching student past classes:', error);
      return [];
    }
  };

  const handleJoinSuccess = () => {
    // Refresh data after successful join
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both active classes and student past classes
        const [activeClassesData, pastClassesData] = await Promise.all([
          fetchActiveClasses(),
          fetchStudentPastClasses()
        ]);
        
        setLiveClasses(activeClassesData);
        setPastClasses(pastClassesData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  if (loading) {
    return <div className="loading">Loading your classes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header 
        title="VidyaVichar - Student Dashboard
        
        " 
        // subtitle="Welcome back, Student 101! Here are your classes."
        onLogout={handleLogout}
      />
      <div className="container">

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
                key={`live-${cls._id || index}`}
                classtopic={cls.classtopic}
                tid={cls.tid}
                date={cls.timestamp}
                isLive={true}
                classId={cls._id}
                onJoinSuccess={handleJoinSuccess}
              />
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: '#6b7280'
            }}>
              No live classes available at the moment.
            </div>
          )
        ) : (
          pastClasses.length > 0 ? (
            pastClasses.map((cls, index) => (
              <ClassCard
                key={`past-${cls._id || index}`}
                classtopic={cls.classtopic}
                tid={cls.tid}
                date={cls.timestamp}
                isLive={false}
                classId={cls._id}
              />
            ))
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

export default StudentDashboard;
