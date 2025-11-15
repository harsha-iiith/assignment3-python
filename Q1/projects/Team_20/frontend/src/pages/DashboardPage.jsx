import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { classService } from '../services/classService';
import ClassCard from '../components/ClassCard';
import CreateClassModal from '../components/CreateClassModal';
import JoinClassModal from '../components/JoinClassModal';
import { useNavigate } from 'react-router-dom';
import { setActiveClass } from '../store/slices/authSlice';

const DashboardPage = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // State to manage the Join Modal and the ID of the class being accessed
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classToAccessId, setClassToAccessId] = useState(null); 

  useEffect(() => {
    loadClasses();

    // Only connect socket for students
    if (user.role === 'student') {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
      const socket = io(socketUrl);

      // Listen for new class creation
      socket.on('classCreated', (newClass) => {
        // Remove accessCode and convert _id to id for student dashboard
        const { accessCode, _id, ...rest } = newClass;
        const classForStudent = { ...rest, id: _id };
        setClasses((prev) => [...prev, classForStudent]);
      });

      // Cleanup on unmount
      return () => {
        socket.off('classCreated');
        socket.disconnect();
      };
    }
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = user.role === 'teacher' 
        ? await classService.getTeacherClasses()
        : await classService.getActiveClasses();
      
      if (result.success) {
        setClasses(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (classData) => {
    const result = await classService.createClass(classData);
    
    if (result.success) {
      // Update state directly for immediate display
      setClasses([...classes, result.data]);
      setShowCreateModal(false);
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };


  const handleClassCardClick = (classId) => {
    if (user.role === 'student') {
        setClassToAccessId(classId); // Store the ID of the class they want to enter
        setShowJoinModal(true);       // Open the access code prompt
    }
  };
  

  const handleJoinClassSubmit = async (accessCode) => {
    if (!classToAccessId) {
        return { success: false, message: "Please select a class first or provide a Class ID." };
    }
    const result = await classService.joinClass(classToAccessId, accessCode); 
    if (result.success) {
      const targetClassId = classToAccessId;
      dispatch(setActiveClass(targetClassId));
      setShowJoinModal(false);
      setClassToAccessId(null); 
      navigate(`/classroom/${targetClassId}`); 
      return { success: true, message: "Access Granted!" };
    } else {
      return { success: false, message: result.message || "Invalid Access Code." };
    }
  };


  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '10px', color: '#333' }}>
          {user.role === 'teacher' ? 'Instructor Dashboard' : 'Student Dashboard'}
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Welcome back, {user.name}!
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Buttons Section */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {user.role === 'teacher' ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              ➕ Create New Class
            </button>
          ) : (
            // The standalone 'Join Class' button functionality is kept, though clicking the card is the primary flow
            <button
              onClick={() => {
                  alert("Please click on a class card below to enter its access code.");
              }}
              className="btn btn-primary"
            >
              🔗 Join Class
            </button>
          )}
        </div>

        {/* Classes Display Section */}
        <div>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            {user.role === 'teacher' ? 'Your Classes' : 'Available Classes'}
          </h2>
          
          {classes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No classes found.</p>
              {user.role === 'teacher' ? (
                <p>Create your first class to get started!</p>
              ) : (
                <p>Click on a class below to enter the access code and join!</p>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {classes
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    classData={classItem}
                    userRole={user.role}
                    // Pass the click handler to the card
                    onStudentClick={handleClassCardClick}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateClass}
        />
      )}

      {showJoinModal && classToAccessId && (
        <JoinClassModal
          onClose={() => {
            setShowJoinModal(false);
            setClassToAccessId(null); // Reset ID on close
          }}
          onSubmit={handleJoinClassSubmit}
        />
      )}
    </div>
  );
};

export default DashboardPage;