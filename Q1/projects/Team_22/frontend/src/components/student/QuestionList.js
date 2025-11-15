import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useApp } from "../../context/AppContext";
import questionService from "../../services/questionService";
import StickyNote from "../common/StickyNote";
import LoadingSpinner from "../common/LoadingSpinner";
import { UI_MESSAGES, QUESTION_STATUS } from "../../utils/constants";

const QuestionListContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionsIcon = styled.span`
  font-size: 1.4rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 20px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatNumber = styled.span`
  font-weight: 600;
  color: ${({ theme, color = "primary" }) => theme.colors[color]};
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const AutoRefreshIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  .pulse {
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.success};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const QuestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  min-height: 200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 300px;
`;

const ErrorState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.danger}10;
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

const LoadingState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

const QuestionList = () => {
  const { state } = useApp();
  const { currentSession } = state;
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadQuestions = useCallback(async () => {
    if (!currentSession?.sessionId) return;

    try {
      setError("");
      const response = await questionService.getQuestionsBySession(
        currentSession.sessionId
      );

      // Handle API response wrapper
      if (response.success) {
        // setQuestions(Array.isArray(response.data) ? response.data : []);
        setQuestions(Array.isArray(response.data.questions) ? response.data.questions : []);
      } else {
        setError(response.message || "Failed to load questions");
        setQuestions([]);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to load questions:", error);
      setError(error.message || UI_MESSAGES.ERROR);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession?.sessionId]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadQuestions();
  };

  // Initial load
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Auto-refresh every 30 seconds (reduced to avoid rate limiting)
  useEffect(() => {
    if (!currentSession?.sessionId) return;

    const interval = setInterval(() => {
      loadQuestions();
    }, 30000); // 30 seconds to reduce API calls

    return () => clearInterval(interval);
  }, [loadQuestions, currentSession?.sessionId]);

  // Calculate statistics (ensure questions is always an array)
  const questionsArray = Array.isArray(questions) ? questions : [];
  // const stats = {
  //   total: questionsArray.length,
  //   unanswered: questionsArray.filter(
  //     (q) => q.status === QUESTION_STATUS.UNANSWERED
  //   ).length,
  //   answered: questionsArray.filter(
  //     (q) => q.status === QUESTION_STATUS.ANSWERED
  //   ).length,
  //   important: questionsArray.filter((q) => q.important).length,
  // };

  const stats = {
    total: questionsArray.length,
    unanswered: questionsArray.filter((q) => !q.isAnswered).length,
    answered: questionsArray.filter((q) => q.isAnswered).length,
    important: questionsArray.filter((q) => q.isImportant).length,
  };


  if (isLoading && questions.length === 0) {
    return (
      <QuestionListContainer>
        <Header>
          <Title>
            <QuestionsIcon>💬</QuestionsIcon>
            Session Questions
          </Title>
        </Header>
        <LoadingState>
          <LoadingSpinner size="medium" />
        </LoadingState>
      </QuestionListContainer>
    );
  }

  if (error && questions.length === 0) {
    return (
      <QuestionListContainer>
        <Header>
          <Title>
            <QuestionsIcon>💬</QuestionsIcon>
            Session Questions
          </Title>
        </Header>
        <ErrorState>
          <div>❌</div>
          <div>{error}</div>
          <RefreshButton onClick={handleRefresh} style={{ marginTop: "1rem" }}>
            Try Again
          </RefreshButton>
        </ErrorState>
      </QuestionListContainer>
    );
  }

  return (
    <QuestionListContainer>
      <Header>
        <Title>
          <QuestionsIcon>💬</QuestionsIcon>
          Session Questions
        </Title>

        <Stats>
          <StatItem>
            Total: <StatNumber>{stats.total}</StatNumber>
          </StatItem>
          <StatItem>
            Unanswered:{" "}
            <StatNumber color="warning">{stats.unanswered}</StatNumber>
          </StatItem>
          <StatItem>
            Answered: <StatNumber color="success">{stats.answered}</StatNumber>
          </StatItem>
          {stats.important > 0 && (
            <StatItem>
              Important:{" "}
              <StatNumber color="danger">{stats.important}</StatNumber>
            </StatItem>
          )}
        </Stats>

        <Controls>
          <RefreshButton onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="small" /> : "🔄"}
            Refresh
          </RefreshButton>

          <AutoRefreshIndicator>
            <div className="pulse" />
            Auto-updating
          </AutoRefreshIndicator>
        </Controls>
      </Header>

      {error && questionsArray.length > 0 && (
        <ErrorState style={{ marginBottom: "1rem" }}>
          <div>⚠️ {error}</div>
        </ErrorState>
      )}

      <QuestionsGrid>
        {questionsArray.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💭</EmptyIcon>
            <EmptyTitle>No questions yet</EmptyTitle>
            <EmptyDescription>
              Questions posted in this session will appear here as sticky notes.
              Be the first to ask a question!
            </EmptyDescription>
          </EmptyState>
        ) : (
          questionsArray
            .sort((a, b) => {
              // Sort by: important first, then by creation time (newest first)
              if (a.important && !b.important) return -1;
              if (!a.important && b.important) return 1;
              // return new Date(b.createdAt) - new Date(a.createdAt);
              return new Date(b.timestamp) - new Date(a.timestamp);

            })
            .map((question) => (
              <StickyNote
                key={question._id}
                question={question}
                showControls={false} // Students can't modify questions
                compact={true}
              />
            ))
        )}
      </QuestionsGrid>

      {lastUpdate && (
        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.75rem",
            color: "#666",
            textAlign: "center",
          }}
        >
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </QuestionListContainer>
  );
};

export default QuestionList;
