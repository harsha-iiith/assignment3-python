import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { questionAPI } from "../utils/api";
import Header from "./layout/Header";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import "./ClassRoom.css";

const ClassRoom = () => {
  const { classId } = useParams();
  const { user, logout } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  useEffect(() => {
    fetchQuestions(true); // Initial load with loading state

    // Set up polling for real-time updates
    const pollInterval = setInterval(() => {
      fetchQuestions(false); // Poll without loading state
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [classId]);

  const fetchQuestions = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      const response = await questionAPI.getQuestions(classId);
      setQuestions(response.data);
    } catch (err) {
      setError("Failed to load questions");
      console.error("Error fetching questions:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      const response = await questionAPI.createQuestion({
        ...questionData,
        classId: classId,
      });
      // Add the new question to the beginning of the list
      setQuestions((prev) => [response.data, ...prev]);
      setShowQuestionForm(false);
      setError(""); // Clear any previous errors
    } catch (err) {
      let errorMessage = "Failed to create question";
      if (err.response?.status === 400) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
    }
  };

  const handleUpdateQuestionStatus = async (questionId, status) => {
    try {
      const response = await questionAPI.updateQuestionStatus(
        questionId,
        status
      );
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, status: status } : q))
      );
    } catch (err) {
      setError("Failed to update question status");
    }
  };

  const canCreateQuestions = user?.role === "student";
  const canModerateQuestions =
    user?.role === "instructor" || user?.role === "ta";

  return (
    <div className="classroom">
      <Header user={user} onLogout={logout} />

      <main className="classroom-main">
        <div className="classroom-header">
          <div className="back-link">
            {user?.role === "instructor" ? (
              <Link to="/dashboard">← End Session</Link>
            ) : (
              <Link to="/dashboard">← Back to Dashboard</Link>
            )}
          </div>
          <div className="class-title">
            <h1>Class Questions</h1>
            {user?.role === "student" && (
              <p>You can ask questions. Teachers will answer them here.</p>
            )}
            {(user?.role === "instructor" || user?.role === "ta") && (
              <p>You can answer questions asked by students.</p>
            )}
            {!user?.role && <p>Ask and answer questions</p>}
          </div>
          <div className="class-actions">
            {canCreateQuestions && (
              <button
                className="action-button primary"
                onClick={() => setShowQuestionForm(true)}
              >
                Ask Question
              </button>
            )}
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

        <div className="classroom-content">
          {showQuestionForm && (
            <div className="question-form-container">
              <QuestionForm
                onSubmit={handleCreateQuestion}
                onCancel={() => setShowQuestionForm(false)}
              />
            </div>
          )}

          <div className="questions-section">
            {loading ? (
              <div className="loading">Loading questions...</div>
            ) : (
              <QuestionList
                questions={questions}
                user={user}
                canModerate={canModerateQuestions}
                onUpdateStatus={handleUpdateQuestionStatus}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClassRoom;
