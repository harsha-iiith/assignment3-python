
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { questionService } from '../services/questionService';
import { classService } from '../services/classService';
import QuestionForm from '../components/QuestionForm';
import QuestionBoard from '../components/QuestionBoard';
import FilterControls from '../components/FilterControls';
import { io } from 'socket.io-client'; // ⬅️ IMPORT SOCKET.IO CLIENT
import { setActiveClass } from '../store/slices/authSlice';

const ClassroomPage = () => {
  const { classId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isTeacher = user.role === "teacher";
  // Assuming access logic is handled elsewhere, we use a simple check for socket connection
  const hasAccess = true;

  // Wrap loadQuestions in useCallback for use in useEffect dependencies
  // Handler for deleting a question (teacher only)
  const handleDeleteQuestion = async (questionId) => {
    const result = await questionService.deleteQuestion(questionId);
    if (result.success) {
      // Reload all questions for teacher after delete
      await loadQuestions();
    } else {
      alert(result.message || 'Failed to delete question');
    }
  };
  const loadQuestions = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) {
        setLoading(true);
      }
      setError("");

      try {
        const result = isTeacher
          ? await questionService.getAllQuestionsForClass(classId)
          : await questionService.getQuestionsByClassId(classId);

        if (result.success) {
          setQuestions(result.data);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("Failed to load questions");
      } finally {
        if (showSpinner) {
          setLoading(false);
        }
      }
    },
    [classId, isTeacher]
  );

  // 1. INITIAL LOAD EFFECT
  useEffect(() => {
    loadClassData();
    loadQuestions();
  }, [classId, loadQuestions]);

  // 2. SOCKET.IO REAL-TIME EFFECT (REPLACES SETTIMEOUT/POLLING)
  useEffect(() => {
    // Only connect if the user is in a class context and has access
    if (!classId || !hasAccess) return;


  // Connect to the server where Socket.IO is running
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
  const socket = io(socketUrl);

    // Join the room specific to this class
    socket.emit("joinClassroom", classId);

    // Listen for the update event from the server
    socket.on("queryUpdate", (data) => {
      console.log(
        `Real-time update received for class: ${data.classId}. Reloading...`
      );
      // When any update occurs (post, answer, importance), silently re-fetch all queries
      loadQuestions(false);
    });

    // Listen for classEnded event (real-time class end)
    socket.on("classEnded", (data) => {
      // Only handle if the event is for this class
      if (data.classId === classId) {
        dispatch(setActiveClass(undefined));
        alert("This class has ended. You will be redirected to the dashboard.");
        navigate("/dashboard");
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off("queryUpdate");
      socket.off("classEnded");
      socket.disconnect();
    };
  }, [classId, hasAccess, loadQuestions, dispatch, navigate]);

  // Check if student has joined the class (activeClass)
  useEffect(() => {
    if (
      !isTeacher &&
      user &&
      (user.activeClass === undefined || user.activeClass !== classId)
    ) {
      alert(
        "You have not joined this class. Please enter the access code to join."
      );
      navigate("/dashboard");
    }
  }, [user, classId, isTeacher, navigate]);

  // Watch for class ended error and handle it
  useEffect(() => {
    if (error && error.toLowerCase().includes("class has ended")) {
      alert("This class has ended. You will be redirected to the dashboard.");
      dispatch(setActiveClass(undefined));
      navigate("/dashboard");
    }
  }, [error, navigate, dispatch]);

  const loadClassData = async () => {
    try {
      const result = await classService.getClassById(classId);
      if (result.success) {
        setClassData(result.data);
      }
    } catch (error) {
      console.error("Failed to load class data:", error);
    }
  };

  const handleCreateQuestion = async (questionData) => {
    const result = await questionService.createQuestion({
      ...questionData,
      author: user.name,
      classId: classId,
    });

    if (result.success) {
      setQuestions([...questions, result.data]);
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  const handleUpdateQuestion = async (questionId, updates) => {
    const result = await questionService.updateQuestion(questionId, updates);

    if (result.success) {
      // 1. Update state locally for immediate feedback
      setQuestions(
        questions.map((q) =>
          q.id === questionId ? { ...q, ...result.data } : q
        )
      );

      // 2. REMOVED: setTimeout(loadQuestions, 1000); ⬅️ Socket.IO handles the re-fetch.

      return { success: true, message: result.message };
    } else {
      // If the API failed, display the error
      return { success: false, message: result.message };
    }
  };


  // Add handler for ending the class
  const handleEndClass = async () => {
    if (window.confirm("Are you sure you want to end this class?")) {
      const result = await classService.endClass(classId);
      if (result.success) {
        alert("Class ended successfully.");
        navigate("/dashboard");
      } else {
        alert(result.message || "Failed to end class.");
      }
    }
  };

  const filteredQuestions = questions.filter((question) => {
    switch (filter) {
      case "unanswered":
        return question.status === "Unanswered";
      case "answered":
        return question.status === "Answered";
      case "important":
        return question.isImportant;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "5px", color: "#333" }}>
              {classData?.title || "Classroom"}
            </h1>
            <p style={{ color: "#666" }}>
              {user.role === "teacher"
                ? "Manage questions from your students"
                : "Ask questions and interact with your class"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-secondary"
            >
              ← Back to Dashboard
            </button>
            {user.role === "teacher" && (
              <button onClick={handleEndClass} className="btn btn-danger">
                End Class
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {user.role === "teacher" && (
          <FilterControls
            filter={filter}
            onFilterChange={setFilter}
            questions={questions}
          />
        )}

        {user.role === "student" && (
          <QuestionForm onSubmit={handleCreateQuestion} />
        )}

        <QuestionBoard
          questions={filteredQuestions}
          userRole={user.role}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
        />
      </div>
    </div>
  );
};

export default ClassroomPage;