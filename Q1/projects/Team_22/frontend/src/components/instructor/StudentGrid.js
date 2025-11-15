import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { Card } from "../../styles/GlobalStyles";
import StickyNote from "../common/StickyNote";
import { groupBy, getInitials } from "../../utils/helpers";

const GridContainer = styled.div`
  display: grid;
  gap: ${theme.spacing[4]};
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StudentCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
  }
`;

const StudentHeader = styled.div`
  padding: ${theme.spacing[4]};
  background: ${theme.colors.primary}10;
  border-bottom: 1px solid ${theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const StudentAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${theme.colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
`;

const StudentName = styled.h4`
  margin: 0;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.lg};
`;

const QuestionStats = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fontSizes.sm};
`;

const StatBadge = styled.span`
  background: ${(props) => {
    switch (props.type) {
      case "total":
        return theme.colors.primary;
      case "unanswered":
        return theme.colors.warning;
      case "answered":
        return theme.colors.success;
      case "important":
        return theme.colors.danger;
      default:
        return theme.colors.muted;
    }
  }};
  color: white;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const QuestionsContainer = styled.div`
  padding: ${theme.spacing[2]};
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.muted};
    border-radius: 3px;

    &:hover {
      background: ${theme.colors.primary};
    }
  }
`;

const EmptyState = styled.div`
  padding: ${theme.spacing[6]};
  text-align: center;
  color: ${theme.colors.muted};

  .icon {
    font-size: 3rem;
    margin-bottom: ${theme.spacing[2]};
  }

  h3 {
    margin-bottom: ${theme.spacing[2]};
    color: ${theme.colors.text};
  }
`;

const NoQuestionsMessage = styled.div`
  padding: ${theme.spacing[4]};
  text-align: center;
  color: ${theme.colors.muted};
  font-style: italic;
`;

const StudentGrid = ({
  questions = [],
  onQuestionStatusChange,
  onQuestionClick,
  onQuestionDelete,
  statusFilter = "all",
  studentFilter = "",
}) => {
  const [expandedStudents, setExpandedStudents] = useState(new Set());

  // Filter and group questions by student
  const { groupedQuestions, studentStats } = useMemo(() => {
    // First filter questions
    let filteredQuestions = questions;

    // Filter by student name if specified
    if (studentFilter.trim()) {
      filteredQuestions = filteredQuestions.filter((q) =>
        q.studentName.toLowerCase().includes(studentFilter.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filteredQuestions = filteredQuestions.filter((q) => {
        switch (statusFilter) {
          case "answered":
            return q.isAnswered;
          case "unanswered":
            return !q.isAnswered;
          case "important":
            return q.isImportant;
          default:
            return true;
        }
      });
    }

    // Group by student
    const grouped = groupBy(filteredQuestions, "studentName");

    // Calculate stats for each student
    const stats = {};
    Object.keys(grouped).forEach((studentName) => {
      const studentQuestions = grouped[studentName];
      stats[studentName] = {
        total: studentQuestions.length,
        answered: studentQuestions.filter((q) => q.isAnswered).length,
        unanswered: studentQuestions.filter((q) => !q.isAnswered).length,
        important: studentQuestions.filter((q) => q.isImportant).length,
      };
    });

    return {
      groupedQuestions: grouped,
      studentStats: stats,
    };
  }, [questions, statusFilter, studentFilter]);

  const toggleStudentExpansion = (studentName) => {
    setExpandedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentName)) {
        newSet.delete(studentName);
      } else {
        newSet.add(studentName);
      }
      return newSet;
    });
  };

  const studentNames = Object.keys(groupedQuestions).sort();

  if (questions.length === 0) {
    return (
      <EmptyState>
        <div className="icon">💭</div>
        <h3>No Questions Yet</h3>
        <p>
          Questions from students will appear here when they start asking during
          the session.
        </p>
      </EmptyState>
    );
  }

  if (studentNames.length === 0) {
    return (
      <EmptyState>
        <div className="icon">🔍</div>
        <h3>No Questions Match Your Filters</h3>
        <p>Try adjusting your filters to see more questions.</p>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {studentNames.map((studentName) => {
        const studentQuestions = groupedQuestions[studentName];
        const stats = studentStats[studentName];
        const isExpanded = expandedStudents.has(studentName);

        return (
          <StudentCard key={studentName}>
            <StudentHeader
              onClick={() => toggleStudentExpansion(studentName)}
              style={{ cursor: "pointer" }}
            >
              <StudentInfo>
                <StudentAvatar>{getInitials(studentName)}</StudentAvatar>
                <StudentName>{studentName}</StudentName>
              </StudentInfo>

              <QuestionStats>
                <StatBadge type="total">{stats.total}</StatBadge>
                {stats.unanswered > 0 && (
                  <StatBadge type="unanswered">{stats.unanswered}</StatBadge>
                )}
                {stats.answered > 0 && (
                  <StatBadge type="answered">{stats.answered}</StatBadge>
                )}
                {stats.important > 0 && (
                  <StatBadge type="important">{stats.important}</StatBadge>
                )}
              </QuestionStats>
            </StudentHeader>

            <QuestionsContainer>
              {studentQuestions.length === 0 ? (
                <NoQuestionsMessage>
                  No questions match the current filters
                </NoQuestionsMessage>
              ) : isExpanded ? (
                studentQuestions
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((question) => (
                    <StickyNote
                      key={question._id}
                      question={question}
                      size="small"
                      isInstructor={true}
                      onStatusChange={onQuestionStatusChange}
                      onClick={() => onQuestionClick?.(question)}
                      onDelete={onQuestionDelete}
                    />
                  ))
              ) : (
                // Show preview of most recent questions when collapsed
                studentQuestions
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .slice(0, 2)
                  .map((question) => (
                    <StickyNote
                      key={question._id}
                      question={question}
                      size="small"
                      isInstructor={true}
                      onStatusChange={onQuestionStatusChange}
                      onClick={() => onQuestionClick?.(question)}
                      onDelete={onQuestionDelete}
                      // showActions={false}
                    />
                  ))
              )}

              {!isExpanded && studentQuestions.length > 2 && (
                <div
                  style={{
                    padding: theme.spacing[2],
                    textAlign: "center",
                    color: theme.colors.primary,
                    cursor: "pointer",
                    fontSize: theme.fontSizes.sm,
                  }}
                  onClick={() => toggleStudentExpansion(studentName)}
                >
                  +{studentQuestions.length - 2} more questions...
                </div>
              )}
            </QuestionsContainer>
          </StudentCard>
        );
      })}
    </GridContainer>
);
};

export default StudentGrid;
