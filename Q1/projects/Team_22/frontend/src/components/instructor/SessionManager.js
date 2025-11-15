import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import {
  Button,
  Card,
  ErrorText,
  SuccessText,
} from "../../styles/GlobalStyles";
import {
  createSession,
  endSession,
  getActiveCourseSession,
} from "../../services/sessionService";
import { copyToClipboard } from "../../utils/helpers";

const ManagerContainer = styled(Card)`
  text-align: center;
`;

const SessionStatus = styled.div`
  padding: ${theme.spacing[6]};

  ${(props) =>
    props.active &&
    `
    background: linear-gradient(135deg, ${theme.colors.success}20, ${theme.colors.primary}20);
    border-radius: ${theme.borderRadius.lg};
  `}
`;

const SessionIdDisplay = styled.div`
  background: ${theme.colors.background};
  border: 2px dashed ${theme.colors.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  margin: ${theme.spacing[4]} 0;
`;

const SessionIdText = styled.div`
  font-family: ${theme.fonts.monospace};
  font-size: ${theme.fontSizes["2xl"]};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing[2]};
  letter-spacing: 2px;
`;

const CopyButton = styled(Button)`
  margin-left: ${theme.spacing[3]};
`;

const SessionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing[4]};
  margin: ${theme.spacing[6]} 0;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
`;

const InfoItem = styled.div`
  text-align: center;

  .label {
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.muted};
    margin-bottom: ${theme.spacing[1]};
  }

  .value {
    font-size: ${theme.fontSizes.lg};
    font-weight: ${theme.fontWeights.semibold};
    color: ${theme.colors.text};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  margin-top: ${theme.spacing[6]};
`;

const SessionManager = ({
  course,
  currentSession,
  onSessionStart,
  onSessionEnd,
  onError,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionStats, setSessionStats] = useState({
    duration: "",
    questionsCount: 0,
    studentsCount: 0,
  });

  // Check for existing active session when course changes
  useEffect(() => {
    if (course && !currentSession) {
      checkActiveSession();
    }
  }, [course]);

  // Update session stats
  useEffect(() => {
    if (currentSession) {
      updateSessionStats();
      // Update stats every minute
      const interval = setInterval(updateSessionStats, 60000);
      return () => clearInterval(interval);
    }
  }, [currentSession]);

  const checkActiveSession = async () => {
    try {
      const response = await getActiveCourseSession(course._id);
      if (response.success) {
        onSessionStart(response.data);
      }
    } catch (err) {
      // No active session found - this is normal
    }
  };

  const updateSessionStats = () => {
    if (!currentSession) return;

    const startTime = new Date(currentSession.startTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now - startTime) / (1000 * 60));

    let duration = "";
    if (diffInMinutes < 60) {
      duration = `${diffInMinutes} min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      duration = `${hours}h ${minutes}m`;
    }

    setSessionStats((prev) => ({
      ...prev,
      duration,
      questionsCount: currentSession.questionCount || 0,
    }));
  };

  const handleStartSession = async () => {
    if (!course) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await createSession({
        courseId: course._id,
        instructor: course.instructor,
      });

      if (response.success) {
        onSessionStart(response.data);
        setSuccess(
          "Session started successfully! Share the session ID with your students."
        );
        onSuccess?.("Session started successfully!");
      } else {
        setError(response.message || "Failed to start session");
        onError?.(response.message || "Failed to start session");
      }
    } catch (err) {
      const errorMsg = "Failed to start session. Please try again.";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    if (
      !window.confirm(
        "Are you sure you want to end this session? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await endSession(currentSession.sessionId);

      if (response.success) {
        onSessionEnd();
        setSuccess("Session ended successfully.");
        onSuccess?.("Session ended successfully.");
      } else {
        setError(response.message || "Failed to end session");
        onError?.(response.message || "Failed to end session");
      }
    } catch (err) {
      const errorMsg = "Failed to end session. Please try again.";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySessionId = async () => {
    if (!currentSession) return;

    const success = await copyToClipboard(currentSession.sessionId);
    if (success) {
      setSuccess("Session ID copied to clipboard!");
      onSuccess?.("Session ID copied to clipboard!");
    } else {
      setError("Failed to copy session ID");
    }
  };

  if (!course) {
    return (
      <ManagerContainer>
        <h3>Session Manager</h3>
        <p>Please select a course first to start a session.</p>
      </ManagerContainer>
    );
  }

  return (
    <ManagerContainer>
      <h3>Session Manager</h3>
      <p>
        Course:{" "}
        <strong>
          {course.title} ({course.code})
        </strong>
      </p>

      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}

      <SessionStatus active={!!currentSession}>
        {currentSession ? (
          <>
            <h4
              style={{
                color: theme.colors.success,
                marginBottom: theme.spacing[4],
              }}
            >
              📍 Session Active
            </h4>

            <SessionIdDisplay>
              <div style={{ marginBottom: theme.spacing[2] }}>
                Share this Session ID with your students:
              </div>
              <SessionIdText>{currentSession.sessionId}</SessionIdText>
              <Button variant="primary" size="sm" onClick={handleCopySessionId}>
                📋 Copy ID
              </Button>
            </SessionIdDisplay>

            <SessionInfo>
              <InfoItem>
                <div className="label">Duration</div>
                <div className="value">{sessionStats.duration}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Questions</div>
                <div className="value">{sessionStats.questionsCount}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Status</div>
                <div className="value" style={{ color: theme.colors.success }}>
                  Active
                </div>
              </InfoItem>
            </SessionInfo>

            <ActionButtons>
              <Button
                variant="danger"
                onClick={handleEndSession}
                disabled={loading}
              >
                {loading ? "Ending..." : "End Session"}
              </Button>
            </ActionButtons>
          </>
        ) : (
          <>
            <h4
              style={{
                color: theme.colors.muted,
                marginBottom: theme.spacing[4],
              }}
            >
              ⏸️ No Active Session
            </h4>
            <p style={{ marginBottom: theme.spacing[6] }}>
              Start a new Q&A session for your students to ask questions in
              real-time.
            </p>

            <ActionButtons>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartSession}
                disabled={loading}
              >
                {loading ? "Starting..." : "🚀 Start Session"}
              </Button>
            </ActionButtons>
          </>
        )}
      </SessionStatus>
    </ManagerContainer>
  );
};

export default SessionManager;
