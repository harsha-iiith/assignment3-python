import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { classAPI } from "../utils/api";
import Header from "./layout/Header";
import ClassCard from "./ClassCard";
import CreateClassModal from "./CreateClassModal";
import JoinClassModal from "./JoinClassModal";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // For now, we'll use a mock until we implement getting classes from API
    // In a real app, we'd call an API to get user's classes
    setLoading(false);
  }, []);

  const handleCreateClass = async (classData) => {
    try {
      const response = await classAPI.createClass(classData);
      if (response.data) {
        // Add the new class to the list
        setClasses((prev) => [response.data, ...prev]);
        setShowCreateModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class");
    }
  };

  const handleJoinClass = async (code) => {
    try {
      const response = await classAPI.joinClass(code);
      if (response.data) {
        // Add the joined class to the list
        setClasses((prev) => [...prev, response.data]);
        setShowJoinModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join class");
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
  };

  return (
    <div className="dashboard">
      <Header user={user} onLogout={logout} />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || user?.email}!</h1>
          <p>Manage your classes and questions</p>

          <div className="dashboard-actions">
            {user?.role === "instructor" && (
              <button
                className="action-button primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Class
              </button>
            )}
            <button
              className="action-button secondary"
              onClick={() => setShowJoinModal(true)}
            >
              Join Class
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError("")} className="close-error">
              ×
            </button>
          </div>
        )}

        <div className="classes-section">
          <h2>Your Classes</h2>
          <div className="classes-grid">
            {loading ? (
              <div className="loading">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="no-classes">
                <p>No classes yet</p>
                {user?.role === "instructor" ? (
                  <p>Create your first class to get started!</p>
                ) : (
                  <p>Join a class to get started!</p>
                )}
              </div>
            ) : (
              classes.map((classItem) => (
                <ClassCard
                  key={classItem._id}
                  classItem={classItem}
                  user={user}
                  onClick={() => handleClassClick(classItem._id)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateClassModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateClass}
        />
      )}

      {showJoinModal && (
        <JoinClassModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinClass}
        />
      )}
    </div>
  );
};

export default Dashboard;
