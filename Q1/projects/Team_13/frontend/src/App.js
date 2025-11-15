import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import LiveClass from './pages/LiveClass';
import PastClass from './pages/PastClass';
import TADashboard from './pages/TADashboard';
import TAClassDetail from './pages/TAClassDetail';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClassDetail from './pages/TeacherClassDetail';
import TeacherPastClassDetail from './pages/TeacherPastClassDetail';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes with Navigation */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Navigation />
                <Routes>
                  {/* Student Routes */}
                  <Route path="/" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/live-class/:classtopic" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <LiveClass />
                    </ProtectedRoute>
                  } />
                  <Route path="/past-class/:classtopic" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <PastClass />
                    </ProtectedRoute>
                  } />
                  
                  {/* TA Routes */}
                  <Route path="/ta" element={
                    <ProtectedRoute allowedRoles={['ta']}>
                      <TADashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/ta/class/:classtopic/:tid" element={
                    <ProtectedRoute allowedRoles={['ta']}>
                      <TAClassDetail />
                    </ProtectedRoute>
                  } />
                  
                  {/* Teacher Routes */}
                  <Route path="/teacher" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/teacher/class/:classtopic/:tid" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherClassDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/teacher/past-class/:classtopic/:tid" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherPastClassDetail />
                    </ProtectedRoute>
                  } />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
