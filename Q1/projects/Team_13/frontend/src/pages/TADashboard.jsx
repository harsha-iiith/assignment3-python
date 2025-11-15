import React, { useState, useEffect } from 'react';
import { getTAInfo, getTeacherClasses } from '../services/taApi';
import ClassSummaryCard from '../components/ClassSummaryCard';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const TADashboard = () => {
  const { user } = useAuth();
  const [taInfo, setTaInfo] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Extract taid from authentication context (email field contains the taid)
        const taid = user?.email;
        
        if (!taid) {
          setError('TA ID not found in authentication context');
          return;
        }
        
        // First, get TA info from teachingassistant table
        const taData = await getTAInfo(taid);
        setTaInfo(taData);
        
        // Then, fetch ALL classes for the assigned teacher
        const teacherClasses = await getTeacherClasses(taData.tid);
        setClasses(teacherClasses);
        
      } catch (err) {
        setError('Failed to fetch TA data');
        console.error('Error fetching TA data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  const handleLogout = () => {
    console.log('TA Logout clicked - ready for backend integration');
    alert('TA Logout functionality ready for backend integration!');
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
        title="VidyaVichar - TA Dashboard" 
        // subtitle={`Welcome, TA ${taInfo?.taid}! View past classes and doubts.`}
        onLogout={handleLogout}
      />
      <div className="container">
        <div className="grid">
          {classes.length > 0 ? (
            classes.map((classData, index) => (
              <ClassSummaryCard
                key={`${classData.classId}-${classData.tid}-${index}`}
                classData={{
                  classtopic: classData.classId,
                  tid: classData.tid,
                  timestamp: classData.createdAt,
                  active: classData.active
                }}
              />
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: '#6b7280'
            }}>
              No classes available for the assigned teacher.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TADashboard;
