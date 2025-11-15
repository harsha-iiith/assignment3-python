import React, { useState } from "react";
import styled from "styled-components";
import { useApp } from "../../context/AppContext";
import questionService from "../../services/questionService";
import LoadingSpinner from "../common/LoadingSpinner";
import { VALIDATION_RULES, UI_MESSAGES } from "../../utils/constants";

const QuestionFormContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const FormTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionIcon = styled.span`
  font-size: 1.4rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.danger : theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    min-height: 100px;
  }
`;

const CharacterCount = styled.div`
  font-size: 0.875rem;
  color: ${({ theme, isNearLimit }) =>
    isNearLimit ? theme.colors.warning : theme.colors.textSecondary};
  text-align: right;
  margin-top: -0.5rem;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.success}20;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid ${({ theme }) => theme.colors.success};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubmitButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const ClearButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const StudentInfo = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StudentName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const QuestionForm = () => {
  const { state, actions } = useApp();
  const { currentSession, studentName } = state;
  const [questionText, setQuestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const maxLength = VALIDATION_RULES.QUESTION.MAX_LENGTH;
  const minLength = VALIDATION_RULES.QUESTION.MIN_LENGTH;
  const isNearLimit = questionText.length > maxLength * 0.8;

  const handleQuestionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setQuestionText(value);

      // Clear error when user starts typing valid content
      if (error && value.trim().length >= minLength) {
        setError("");
      }

      // Clear success message when user starts typing again
      if (successMessage && value.trim() !== "") {
        setSuccessMessage("");
      }
    }
  };

  const validateQuestion = () => {
    const trimmedText = questionText.trim();

    if (!trimmedText) {
      setError("Please enter your question");
      return false;
    }

    if (trimmedText.length < minLength) {
      setError(`Question must be at least ${minLength} characters long`);
      return false;
    }

    if (trimmedText.length > maxLength) {
      setError(`Question must be no more than ${maxLength} characters long`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateQuestion()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const questionData = {
        sessionId: currentSession.sessionId,
        studentName: studentName,
        content: questionText.trim(),
      };

      await questionService.createQuestion(questionData);

      // Success! Clear the form and show success message
      setQuestionText("");
      setSuccessMessage("Your question has been posted successfully! 🎉");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

      // Refresh questions list if needed
      actions.refreshQuestions?.();
    } catch (error) {
      console.error("Failed to post question:", error);
      setError(
        error.response?.data?.message ||
          UI_MESSAGES.ERROR ||
          "Failed to post your question. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestionText("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <QuestionFormContainer>
      <FormTitle>
        <QuestionIcon>❓</QuestionIcon>
        Ask a Question
      </FormTitle>

      <StudentInfo>
        Posting as: <StudentName>{studentName}</StudentName> in session{" "}
        <StudentName>{currentSession?.sessionId}</StudentName>
      </StudentInfo>

      <Form onSubmit={handleSubmit}>
        <TextArea
          value={questionText}
          onChange={handleQuestionChange}
          placeholder="Type your question here... (e.g., Could you explain the difference between props and state in React?)"
          hasError={!!error}
          disabled={isLoading}
        />

        <CharacterCount isNearLimit={isNearLimit}>
          {questionText.length} / {maxLength} characters
        </CharacterCount>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <ButtonGroup>
          <ClearButton
            type="button"
            onClick={handleClear}
            disabled={isLoading || !questionText.trim()}
          >
            Clear
          </ClearButton>

          <SubmitButton
            type="submit"
            disabled={isLoading || !questionText.trim()}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                Posting...
              </>
            ) : (
              <>Post Question</>
            )}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </QuestionFormContainer>
  );
};

export default QuestionForm;
