import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useApp } from "../context/AppContext";
import SessionJoin from "../components/student/SessionJoin";
import QuestionForm from "../components/student/QuestionForm";
import QuestionList from "../components/student/QuestionList";
import Header from "../components/common/Header";
import ErrorBoundary from "../components/common/ErrorBoundary";
// import LoadingSpinner from '../components/common/LoadingSpinner';
import sessionService from "../services/sessionService";
import { USER_ROLES } from "../utils/constants";

const StudentContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const SessionHeader = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const SessionTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SessionInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 20px;
`;

const InfoLabel = styled.span`
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: "Courier New", monospace;
`;

const SessionControls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LeaveButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.danger};
    color: white;
  }
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ theme, status }) =>
    status === "active"
      ? theme.colors.success + "20"
      : theme.colors.warning + "20"};
  color: ${({ theme, status }) =>
    status === "active" ? theme.colors.success : theme.colors.warning};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
`;

const WelcomeSection = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const WelcomeTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const WelcomeDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const HomeButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const StudentInterface = () => {
  const { state, actions } = useApp();
  const { currentSession, sessionJoined, studentName, userRole } = state;
  const [sessionStatus, setSessionStatus] = useState("active");
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  // Check session status periodically
  useEffect(() => {
    if (!currentSession?.sessionId) return;

    const checkSessionStatus = async () => {
      try {
        setIsCheckingSession(true);
        const response = await sessionService.getSessionById(
          currentSession.sessionId
        );

        if (response.success) {
          const sessionData = response.data;
          setSessionStatus(sessionData.isActive ? "active" : "inactive");

          // Update session data if needed
          if (sessionData.isActive !== currentSession.isActive) {
            actions.setCurrentSession(sessionData);
          }
        } else {
          setSessionStatus("error");
        }
      } catch (error) {
        console.error("Failed to check session status:", error);
        setSessionStatus("error");
      } finally {
        setIsCheckingSession(false);
      }
    };

    // Check immediately
    checkSessionStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkSessionStatus, 30000);
    return () => clearInterval(interval);
  }, [currentSession?.sessionId, actions]);

  const handleLeaveSession = () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this session? You'll need to rejoin with the session ID."
    );

    if (confirmLeave) {
      actions.setCurrentSession(null);
      actions.setSessionJoined(false);
      actions.setStudentName("");
    }
  };

  // Redirect if not student role
  if (userRole !== USER_ROLES.STUDENT) {
    return (
      <StudentContainer>
        <MainContent>
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <h2>Access Denied</h2>
            <p>
              Please select the Student role from the home page to access this
              interface.
            </p>
          </div>
        </MainContent>
      </StudentContainer>
    );
  }

  // Show welcome screen if not joined to any session
  if (!sessionJoined || !currentSession) {
    return (
      <StudentContainer>
        <Header
          title="VidyaVichara - Student"
          showBackButton={true}
          onBack={() => actions.setUserRole(null)}
        />
        <MainContent>
          <WelcomeSection>
            <HomeButton onClick={() => actions.resetApp()}>
              🏠 Back to Home
            </HomeButton>
            <WelcomeTitle>Welcome, Student! 🎓</WelcomeTitle>
            <WelcomeDescription>
              Join a live Q&A session and participate in interactive learning.
              Ask questions during lectures and see them displayed as colorful
              sticky notes on the instructor's board.
            </WelcomeDescription>
          </WelcomeSection>

          <FeatureList>
            <FeatureCard>
              <FeatureIcon>🔗</FeatureIcon>
              <FeatureTitle>Join Sessions</FeatureTitle>
              <FeatureDescription>
                Enter the session ID provided by your instructor to join live
                Q&A sessions
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>❓</FeatureIcon>
              <FeatureTitle>Ask Questions</FeatureTitle>
              <FeatureDescription>
                Post your questions during lectures and see them appear as
                sticky notes
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>👥</FeatureIcon>
              <FeatureTitle>See All Questions</FeatureTitle>
              <FeatureDescription>
                View questions from other students and see when they get
                answered by the instructor
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🔄</FeatureIcon>
              <FeatureTitle>Real-time Updates</FeatureTitle>
              <FeatureDescription>
                Questions update automatically so you always see the latest
                discussion
              </FeatureDescription>
            </FeatureCard>
          </FeatureList>

          <ErrorBoundary>
            <SessionJoin />
          </ErrorBoundary>
        </MainContent>
      </StudentContainer>
    );
  }

  // Show main student interface when joined to a session
  return (
    <StudentContainer>
      <Header
        title="VidyaVichara - Student"
        showBackButton={true}
        onBack={() => actions.resetApp()}
      />{" "}
      <MainContent>
        <SessionHeader>
          <SessionTitle>
            📝 {currentSession.course?.title || "Q&A Session"}
          </SessionTitle>

          <SessionInfo>
            <InfoItem>
              <InfoLabel>Session:</InfoLabel>
              <InfoValue>{currentSession.sessionId}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Student:</InfoLabel>
              <InfoValue>{studentName}</InfoValue>
            </InfoItem>

            {currentSession.course && (
              <InfoItem>
                <InfoLabel>Course:</InfoLabel>
                <InfoValue>{currentSession.course.code}</InfoValue>
              </InfoItem>
            )}

            <StatusIndicator status={sessionStatus}>
              <StatusDot />
              {isCheckingSession
                ? "Checking..."
                : sessionStatus === "active"
                ? "Active"
                : sessionStatus === "inactive"
                ? "Inactive"
                : "Error"}
            </StatusIndicator>
          </SessionInfo>

          <SessionControls>
            <LeaveButton onClick={handleLeaveSession}>
              👈 Leave Session
            </LeaveButton>
          </SessionControls>
        </SessionHeader>

        {sessionStatus === "inactive" && (
          <div
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              textAlign: "center",
              border: "1px solid #ffeaa7",
            }}
          >
            ⚠️ This session is currently inactive. You can view existing
            questions but cannot post new ones.
          </div>
        )}

        <ErrorBoundary>
          {sessionStatus === "active" && <QuestionForm />}
        </ErrorBoundary>

        <ErrorBoundary>
          <QuestionList />
        </ErrorBoundary>
      </MainContent>
    </StudentContainer>
  );
};

export default StudentInterface;
