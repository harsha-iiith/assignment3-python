import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { theme } from "../../styles/theme";
import { STICKY_NOTE_COLORS, QUESTION_STATUS } from "../../utils/constants";
import { formatTime, getInitials } from "../../utils/helpers";
import { stickyNotePeel } from "../../styles/GlobalStyles";

const StickyNoteContainer = styled.div`
  position: relative;
  background: ${(props) => getStickyNoteColor(props.question)};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin: ${theme.spacing[2]};
  min-height: ${(props) =>
    props.size === "small"
      ? "120px"
      : props.size === "large"
      ? "200px"
      : "150px"};
  max-width: ${(props) =>
    props.size === "small"
      ? "180px"
      : props.size === "large"
      ? "280px"
      : "220px"};
  box-shadow: ${theme.shadows.stickyNote};
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  transition: all ${theme.transitions.normal};
  transform-style: preserve-3d;

  &:hover {
    box-shadow: ${theme.shadows.stickyNoteHover};
    transform: translateY(-2px);
    animation: ${stickyNotePeel} 0.6s ease-in-out;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(0, 0, 0, 0.1) 100%
    );
    border-radius: 0 ${theme.borderRadius.lg} 0 0;
  }
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
  padding-bottom: ${theme.spacing[2]};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const StudentAvatar = styled.div`
  width: 24px;
  height: 24px;
  background: ${theme.colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  margin-right: ${theme.spacing[2]};
`;

const StudentName = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text};
  flex: 1;
`;

const Timestamp = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.muted};
`;

const QuestionContent = styled.div`
  font-size: ${(props) =>
    props.size === "small" ? theme.fontSizes.xs : theme.fontSizes.sm};
  line-height: ${theme.lineHeights.normal};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing[3]};
  word-wrap: break-word;
`;

const StatusIndicators = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
  margin-top: auto;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  border-radius: ${theme.borderRadius.full};
  text-transform: uppercase;

  ${(props) => {
    if (props.type === "answered") {
      return `
        background: ${theme.colors.success};
        color: white;
      `;
    }
    if (props.type === "important") {
      return `
        background: ${theme.colors.danger};
        color: white;
      `;
    }
    return `
      background: ${theme.colors.warning};
      color: white;
    `;
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
  margin-top: ${theme.spacing[2]};
  opacity: 0;
  transition: opacity ${theme.transitions.fast};

  ${StickyNoteContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: white;
    transform: scale(1.05);
  }
`;

// Helper function to determine sticky note color
const getStickyNoteColor = (question) => {
  if (question.isAnswered && question.isImportant) {
    return STICKY_NOTE_COLORS.answered_important;
  }
  if (question.isImportant) {
    return STICKY_NOTE_COLORS[QUESTION_STATUS.IMPORTANT];
  }
  if (question.isAnswered) {
    return STICKY_NOTE_COLORS[QUESTION_STATUS.ANSWERED];
  }
  return STICKY_NOTE_COLORS[QUESTION_STATUS.UNANSWERED];
};

const StickyNote = ({
  question,
  size = "medium",
  isInstructor = false,
  onStatusChange,
  onDelete,
  onClick,
  showActions = true,
}) => {
  const handleAnsweredToggle = (e) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(question._id, "toggle_answered");
    }
  };

  const handleImportantToggle = (e) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(question._id, "toggle_important");
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this question?")) {
      onDelete?.(question._id);  // <-- call parent handler
    }
  };

  const truncatedContent =
    size === "small" && question.content.length > 100
      ? question.content.substring(0, 100) + "..."
      : question.content;

  return (
    <StickyNoteContainer question={question} size={size} onClick={onClick}>
      <StudentInfo>
        <StudentAvatar>{getInitials(question.studentName)}</StudentAvatar>
        <StudentName>{question.studentName}</StudentName>
        <Timestamp>{formatTime(question.timestamp)}</Timestamp>
      </StudentInfo>

      <QuestionContent size={size}>{truncatedContent}</QuestionContent>

      <StatusIndicators>
        {question.isAnswered && (
          <StatusBadge type="answered">Answered</StatusBadge>
        )}
        {question.isImportant && (
          <StatusBadge type="important">Important</StatusBadge>
        )}
        {!question.isAnswered && !question.isImportant && (
          <StatusBadge type="unanswered">New</StatusBadge>
        )}
      </StatusIndicators>

      {isInstructor && showActions && (
        <ActionButtons>
          <ActionButton
            onClick={handleAnsweredToggle}
            title={
              question.isAnswered ? "Mark as unanswered" : "Mark as answered"
            }
          >
            {question.isAnswered ? "↩️" : "✅"}
          </ActionButton>
          <ActionButton
            onClick={handleImportantToggle}
            title={
              question.isImportant ? "Remove important" : "Mark as important"
            }
          >
            {question.isImportant ? "⭐" : "⚡"}
          </ActionButton>
          <ActionButton onClick={handleDelete} title="Delete question">
            ❌
          </ActionButton>

        </ActionButtons>
      )}
    </StickyNoteContainer>
  );
};

export default StickyNote;
