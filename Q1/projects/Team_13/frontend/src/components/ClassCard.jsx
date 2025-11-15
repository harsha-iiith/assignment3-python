import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClassCard = ({ classtopic, tid, date, isLive, isTeacher = false, classId, onJoinSuccess }) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleButtonClick = async () => {
    if (isTeacher) {
      navigate(`/teacher/class/${encodeURIComponent(classtopic)}/${encodeURIComponent(tid)}`);
    } else if (isLive && !hasJoined) {
      // Handle join class functionality
      await handleJoinClass();
    } else if (isLive && hasJoined) {
      navigate(`/live-class/${encodeURIComponent(classtopic)}`);
    } else {
      navigate(`/past-class/${encodeURIComponent(classtopic)}`);
    }
  };

  const handleJoinClass = async () => {
    try {
      setIsJoining(true);
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      
      // Mock student data - in real app, get from auth context
      const studentData = {
        studentId: 'student_101',
        studentEmail: 'student@example.com'
      };

      const response = await axios.post(`${API_BASE_URL}/api/classes/${classId}/join`, studentData);
      
      if (response.data.success) {
        setHasJoined(true);
        if (onJoinSuccess) {
          onJoinSuccess();
        }
        // Navigate to live class after successful join
        navigate(`/live-class/${encodeURIComponent(classtopic)}`);
      }
    } catch (error) {
      console.error('Error joining class:', error);
      if (error.response?.data?.error === 'Student already joined this class') {
        setHasJoined(true);
        navigate(`/live-class/${encodeURIComponent(classtopic)}`);
      } else {
        alert('Failed to join class. Please try again.');
      }
    } finally {
      setIsJoining(false);
    }
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

  return (
    <div className="card" style={{
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '12px',
          lineHeight: '1.3'
        }}>
          {classtopic}
        </h3>
        
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px',
          marginBottom: '8px',
          fontWeight: '500'
        }}>
          Teacher ID: {tid}
        </p>
        
        <p style={{ 
          color: '#9ca3af', 
          fontSize: '13px',
          marginBottom: '20px'
        }}>
          {formatDate(date)}
        </p>

        {/* Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: isLive ? '#f0fdf4' : '#f9fafb',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isLive ? '#10b981' : '#6b7280',
            marginRight: '8px'
          }}></div>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: isLive ? '#059669' : '#6b7280'
          }}>
            {isLive ? 'LIVE NOW' : 'PAST CLASS'}
          </span>
        </div>
      </div>
      
      <button 
        className={`btn ${isLive ? 'btn-success' : 'btn-secondary'}`}
        onClick={handleButtonClick}
        disabled={isJoining}
        style={{ 
          width: '100%',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '8px',
          border: 'none',
          cursor: isJoining ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: isJoining ? 0.7 : 1
        }}
      >
        {isTeacher ? 'Manage Doubts' : 
         isLive ? (isJoining ? 'Joining...' : hasJoined ? 'Enter Class' : 'Join Class') : 
         'View Doubts'}
      </button>
    </div>
  );
};

export default ClassCard;
