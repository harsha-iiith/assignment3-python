import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { postQuestion, markAnswered } from "../api/questionApi";
import { postReply } from "../api/replyApi";
import { markSeen } from "../api/updateApi";
import { endSession } from "../api/sessionApi";
import axios from "../api/axiosInstance";

async function fetchSession(sessionId) {
  // Use existing getMySessions endpoint and filter client-side
  const sessions = await axios.get("/sessions").then(r => r.data);
  return sessions.find(s => s.sessionId === sessionId) || null;
}

// utility: reorganize replies into nested tree
function buildReplyTree(replies) {
  const map = {};
  const roots = [];
  replies.forEach(r => (map[r._id] = { ...r, children: [] }));
  replies.forEach(r => {
    if (r.parentReplyId) {
      const parent = map[r.parentReplyId];
      if (parent) parent.children.push(map[r._id]);
      else roots.push(map[r._id]);
    } else roots.push(map[r._id]);
  });
  return roots;
}

export default function SessionView() {
  console.log("SessionView component rendered");
  const { sessionId } = useParams();
  console.log("SessionView - sessionId from useParams:", sessionId);
  const socket = useSocket();
  const { user, setSessionState } = useAuthContext();
  const [session, setSession] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null); // for replies
  const [replyText, setReplyText] = useState("");
  const [questionFilter, setQuestionFilter] = useState("all"); // New state for filter

  useEffect(() => {
    (async () => {
      try {
        // fetch session by sessionId
        const s = await fetchSession(sessionId);
        setSession(s || null);
        
        // Set session state for logout protection - ONLY for live sessions
        if (s && s.status === "live") {
          setSessionState(true);
        }
        
        // mark seen
        if (s) {
          try {
            await markSeen(sessionId);
          } catch (markSeenError) {
            console.warn("Could not mark session as seen:", markSeenError);
          }
        }
      } catch (error) {
        console.error("Error loading session:", error);
        setSession(null);
      }
    })();

    // Cleanup: clear session state when component unmounts
    return () => {
      setSessionState(false);
    };
  }, [sessionId, setSessionState]);

  useEffect(() => {
    console.log("SessionView useEffect: socket, sessionId", socket, sessionId);
    if (!socket || !sessionId) return;
    socket.emit("joinSession", sessionId);

    socket.on("question:created", (q) => {
      setSession(prev => prev ? { ...prev, questions: [...prev.questions, q] } : prev);
    });

    socket.on("reply:created", ({ questionId, reply }) => {
      setSession(prev => {
        if (!prev) return prev;
        const qs = prev.questions.map(q => q._id === questionId ? { ...q, replies: [...q.replies, reply], updatedAt: new Date().toISOString() } : q);
        return { ...prev, questions: qs };
      });
    });

    socket.on("question:answered", ({ questionId }) => {
      console.log("Frontend: question:answered event received for questionId:", questionId);
      setSession(prev => {
        if (!prev) return prev;
        const qs = prev.questions.map(q => q._id === questionId ? { ...q, status: "answered", updatedAt: new Date().toISOString() } : q);
        console.log("Frontend: new questions state after answered:", qs);
        return { ...prev, questions: qs };
      });
    });

    socket.on("session:ended", (updatedSession) => {
      console.log("Frontend: session:ended event received");
      setSession(prev => prev ? { ...prev, status: "completed", endAt: updatedSession.endAt } : prev);
    });

    return () => {
      socket.emit("leaveSession", sessionId);
      socket.off("question:created");
      socket.off("reply:created");
      socket.off("question:answered");
      socket.off("session:ended");
    };
  }, [socket, sessionId]);

  // Navigation protection for active sessions
  useEffect(() => {
    if (!session || session.status !== "live") return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "You are currently in an active session. Are you sure you want to leave?";
      return event.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session]);

  // Update session state when session status changes
  useEffect(() => {
    if (session) {
      if (session.status === "live") {
        setSessionState(true);
      } else {
        setSessionState(false);
      }
    }
  }, [session?.status, setSessionState]);

  if (!session) return <div style={{padding:20}}>
    Loading session...
    {sessionId && <div style={{fontSize: 12, color: "var(--secondary-color)", marginTop: 10}}>
      Session ID: {sessionId}
    </div>}
  </div>;

  const isInstructor = user.role === "instructor" && user.courses.some(c => c.courseName === session.courseName && c.isInstructor);
  const isTA = user.courses.some(c => c.courseName === session.courseName && c.isTA);
  const isEnrolled = user.courses.some(c => c.courseName === session.courseName && c.enrolled);

  const canPostQuestion = session.status === "live" && user.role === "student" && isEnrolled;
  const canReplyNow = session.status === "live" ? isInstructor : (isInstructor || isTA);

  const handlePostQuestion = async () => {
    if (!questionText.trim()) return;
    try {
      const newQuestion = await postQuestion(sessionId, questionText);
      setSession(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
      setQuestionText("");
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message;
      if (e.response?.status === 400 && errorMsg.includes("Duplicate question")) {
        alert("This question has already been asked. Please ask a different question.");
      } else if (e.response?.status === 403) {
        alert("You don't have permission to post questions in this session.");
      } else {
        alert(`Failed to post question: ${errorMsg}`);
      }
    }
  };

  const handlePostReply = async (qId, parentId = null) => {
    if (!replyText.trim()) return;
    try {
      const newReply = await postReply(sessionId, qId, replyText, parentId);
      setSession(prev => {
        const newQuestions = prev.questions.map(q => {
          if (q._id === qId) {
            return { ...q, replies: [...q.replies, newReply] };
          }
          return q;
        });
        return { ...prev, questions: newQuestions };
      });
      setReplyText("");
      setSelectedQuestion(null);
      // If instructor replies, automatically mark question as answered
      if (user.role === "instructor") {
        try {
          await markAnswered(sessionId, qId);
        } catch (markError) {
          console.warn("Could not auto-mark question as answered:", markError);
        }
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message;
      if (e.response?.status === 403) {
        alert("You don't have permission to reply in this session.");
      } else {
        alert(`Failed to post reply: ${errorMsg}`);
      }
    }
  };

  const handleMarkAnswered = async (qId) => {
    try {
      // Optimistically update the UI immediately
      setSession(prev => {
        if (!prev) return prev;
        const updatedQuestions = prev.questions.map(q => 
          q._id === qId ? { ...q, status: "answered", updatedAt: new Date().toISOString() } : q
        );
        return { ...prev, questions: updatedQuestions };
      });
      
      // Then make the API call
      await markAnswered(sessionId, qId);
    } catch (e) {
      // If the API call fails, revert the optimistic update
      setSession(prev => {
        if (!prev) return prev;
        const revertedQuestions = prev.questions.map(q => 
          q._id === qId ? { ...q, status: "unanswered", updatedAt: new Date().toISOString() } : q
        );
        return { ...prev, questions: revertedQuestions };
      });
      
      const errorMsg = e.response?.data?.message || e.message;
      if (e.response?.status === 403) {
        alert("You don't have permission to mark questions as answered.");
      } else {
        alert(`Failed to mark question as answered: ${errorMsg}`);
      }
    }
  };

  const handleEndSession = async () => {
    if (!window.confirm("Are you sure you want to end this session? This action cannot be undone.")) {
      return;
    }
    try {
      await endSession(sessionId);
      setSession(prev => ({ ...prev, status: "completed" }));
      alert("Session has been ended successfully.");
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message;
      if (e.response?.status === 403) {
        alert("You don't have permission to end this session.");
      } else {
        alert(`Failed to end session: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="container fade-in">
      <div className="card mb-6">
        <div className="card-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <div>
              <h1 className="card-title" style={{ marginBottom: "var(--space-2)" }}>{session.courseName}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span style={{
                  background: session.status === 'live' ? 'var(--success-color)' : 
                             session.status === 'active' ? 'var(--info-color)' : 'var(--text-muted)',
                  color: 'white',
                  padding: "var(--space-1) var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-1)"
                }}>
                  {session.status === 'live' && '🔴 '}
                  {session.status === 'active' && '🟡 '}
                  {session.status === 'completed' && '✅ '}
                  {session.status}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  Session ID: {sessionId}
                </span>
              </div>
            </div>
            {isInstructor && session.status === "live" && (
              <button 
                onClick={handleEndSession}
                className="btn-danger"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "var(--space-2)",
                  fontSize: "0.875rem"
                }}
              >
                🛑 End Session
              </button>
            )}
          </div>
        </div>
      </div>

      <section>
        {canPostQuestion && (
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="card-title">Ask a Question</h2>
              <p className="card-subtitle">Share your question with the class</p>
            </div>
            <div className="form-group">
              <textarea 
                value={questionText} 
                onChange={e => setQuestionText(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handlePostQuestion())} 
                rows={4} 
                placeholder="Type your question here... (Press Enter to submit, Shift+Enter for new line)"
                style={{ marginBottom: "var(--space-4)" }}
              />
              <button onClick={handlePostQuestion} className="btn-success" style={{ width: "100%" }}>
                📝 Post Question
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              Questions & Answers
              {session.questions.length > 0 && (
                <span style={{ 
                  background: "var(--primary-color)", 
                  color: "white", 
                  borderRadius: "var(--radius-md)", 
                  padding: "0.25rem 0.5rem", 
                  fontSize: "0.75rem", 
                  marginLeft: "var(--space-2)" 
                }}>
                  {session.questions.length}
                </span>
              )}
            </h2>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              <button 
                onClick={() => setQuestionFilter("all")} 
                className={questionFilter === "all" ? "" : "btn-outline"}
                style={{ 
                  fontSize: "0.875rem",
                  background: questionFilter === "all" ? "var(--primary-gradient)" : "transparent"
                }}
              >
                All ({session.questions.length})
              </button>
              <button 
                onClick={() => setQuestionFilter("answered")} 
                className={questionFilter === "answered" ? "btn-success" : "btn-outline"}
                style={{ 
                  fontSize: "0.875rem",
                  background: questionFilter === "answered" ? "var(--success-color)" : "transparent",
                  borderColor: "var(--success-color)",
                  color: questionFilter === "answered" ? "white" : "var(--success-color)"
                }}
              >
                ✅ Answered ({session.questions.filter(q => q.status === "answered").length})
              </button>
              <button 
                onClick={() => setQuestionFilter("unanswered")} 
                className={questionFilter === "unanswered" ? "btn-danger" : "btn-outline"}
                style={{ 
                  fontSize: "0.875rem",
                  background: questionFilter === "unanswered" ? "var(--warning-color)" : "transparent",
                  borderColor: "var(--warning-color)",
                  color: questionFilter === "unanswered" ? "white" : "var(--warning-color)"
                }}
              >
                ⏳ Unanswered ({session.questions.filter(q => q.status === "unanswered").length})
              </button>
            </div>
          </div>
          {session.questions.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "var(--space-8)", 
              color: "var(--text-muted)" 
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>❓</div>
              <h3 style={{ color: "var(--text-muted)" }}>No Questions Yet</h3>
              <p>Be the first to ask a question in this session!</p>
            </div>
          )}
          {session.questions
            .filter(q => {
              if (questionFilter === "answered") return q.status === "answered";
              if (questionFilter === "unanswered") return q.status === "unanswered";
              return true; // "all" filter
            })
            .slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((q, index) => {
              // Sticky note colors based on status
              const stickyColors = {
                answered: '#d4f8d4',    // Light green
                unanswered: '#fff3a0'   // Light yellow
              };
              
              // Random slight rotation for authentic sticky note feel
              const rotations = [-2, -1, 0, 1, 2, -1.5, 1.5];
              const rotation = rotations[index % rotations.length];
              
              return (
                <div key={q._id} style={{
                  background: stickyColors[q.status] || '#f0f8ff',
                  padding: "var(--space-4)",
                  marginBottom: "var(--space-6)",
                  borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
                  transform: `rotate(${rotation}deg)`,
                  transition: "var(--transition-normal)",
                  position: "relative",
                  fontFamily: "'Comic Sans MS', 'Marker Felt', cursive, sans-serif",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  minHeight: "120px",
                  maxWidth: "400px",
                  margin: "var(--space-6) auto",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = `rotate(0deg) scale(1.02)`;
                  e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = `rotate(${rotation}deg) scale(1)`;
                  e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Sticky note tape effect at top */}
                <div style={{
                  position: "absolute",
                  top: "-1px",
                  left: "30%",
                  right: "30%",
                  height: "20px",
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "0 0 var(--radius-sm) var(--radius-sm)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderTop: "none"
                }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-4)" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "1.125rem", 
                    fontWeight: "500", 
                    color: "var(--text-primary)", 
                    lineHeight: "1.6",
                    marginBottom: "var(--space-3)"
                  }}>
                    {q.text}
                  </p>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "var(--space-3)", 
                    fontSize: "0.875rem", 
                    color: "var(--text-secondary)" 
                  }}>
                    <span>👤 {q.author.name}</span>
                    <span>•</span>
                    <span style={{
                      background: q.status === "answered" ? "var(--success-color)" : "var(--warning-color)",
                      color: "white",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      textTransform: "capitalize"
                    }}>
                      {q.status === "answered" ? "✅ Answered" : "⏳ Pending"}
                    </span>
                    <span>•</span>
                    <span>🕒 {new Date(q.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div>
                  {/* Instructors can mark answered during live or after; TAs can only mark answered after session ends */}
                  {((isInstructor && (session.status === "live" || session.status === "completed")) || 
                    (isTA && session.status === "completed")) && q.status === "unanswered" && (
                    <button 
                      onClick={() => handleMarkAnswered(q._id)} 
                      className="btn-success"
                      style={{ fontSize: "0.75rem", padding: "var(--space-1) var(--space-2)" }}
                    >
                      ✅ Mark Answered
                    </button>
                  )}
                </div>
              </div>

              {q.replies && q.replies.length > 0 && (
                <div style={{ 
                  marginTop: "var(--space-4)", 
                  padding: "var(--space-4)", 
                  background: "var(--background-secondary)", 
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)"
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    marginBottom: "var(--space-3)", 
                    fontSize: "1rem", 
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)"
                  }}>
                    💬 Replies ({q.replies.length})
                  </h4>
                  <ReplyThread replies={buildReplyTree(q.replies)} />
                </div>
              )}

              {canReplyNow && (
                <div style={{ 
                  marginTop: "var(--space-4)", 
                  padding: "var(--space-4)", 
                  background: "rgba(102, 126, 234, 0.05)", 
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--primary-color)"
                }}>
                  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "end" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ 
                        display: "block", 
                        marginBottom: "var(--space-2)", 
                        fontSize: "0.875rem", 
                        fontWeight: "500", 
                        color: "var(--primary-color)" 
                      }}>
                        💭 Add your reply or clarification
                      </label>
                      <input 
                        placeholder="Type your response... (Press Enter to send)"
                        value={selectedQuestion === q._id ? replyText : ""} 
                        onChange={e => { setSelectedQuestion(q._id); setReplyText(e.target.value); }} 
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handlePostReply(q._id))}
                        style={{ margin: 0 }}
                      />
                    </div>
                    <button 
                      onClick={() => handlePostReply(q._id)}
                      disabled={!replyText.trim() || selectedQuestion !== q._id}
                      style={{ marginBottom: 0 }}
                    >
                      📤 Send Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

// Enhanced recursive reply component
function ReplyThread({ replies }) {
  if (!replies || replies.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {replies.map(r => (
        <div key={r._id} style={{
          padding: "var(--space-3) var(--space-4)",
          background: "var(--surface-color)",
          borderLeft: "3px solid var(--primary-color)",
          borderRadius: "0 var(--radius-md) var(--radius-md) 0",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "var(--space-2)", 
            marginBottom: "var(--space-2)"
          }}>
            <span style={{
              background: "var(--primary-color)",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: "500"
            }}>
              {r.author.name.charAt(0).toUpperCase()}
            </span>
            <strong style={{ color: "var(--text-primary)", fontSize: "0.875rem" }}>
              {r.author.name}
            </strong>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              • {new Date(r.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <p style={{ 
            margin: 0, 
            color: "var(--text-secondary)", 
            fontSize: "0.875rem",
            lineHeight: "1.5",
            marginLeft: "32px"
          }}>
            {r.text}
          </p>
          {r.children && r.children.length > 0 && (
            <div style={{ marginLeft: "var(--space-6)", marginTop: "var(--space-3)" }}>
              <ReplyThread replies={r.children} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
