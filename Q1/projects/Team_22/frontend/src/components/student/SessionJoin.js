import React, { useState } from "react";
import styled from "styled-components";
import { useApp } from "../../context/AppContext";
import sessionService from "../../services/sessionService";
import LoadingSpinner from "../common/LoadingSpinner";
import { VALIDATION_RULES, UI_MESSAGES } from "../../utils/constants";
import { validateSessionId } from "../../utils/validators";

const SessionJoinContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.danger : theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: "Courier New", monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: none;
    letter-spacing: normal;
    font-family: inherit;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: left;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const HelpText = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: left;
`;

const ExampleId = styled.code`
  background: ${({ theme }) => theme.colors.border};
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const SessionJoin = () => {
  const { actions } = useApp();
  const [sessionId, setSessionId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSessionIdChange = (e) => {
    let value = e.target.value.toUpperCase();

    // Auto-add VV- prefix if not present
    if (value && !value.startsWith("VV-")) {
      value = "VV-" + value.replace(/^VV-?/, "");
    }

    // Limit to expected format length
    if (value.length <= 9) {
      // VV-XXXXXX = 9 characters max
      setSessionId(value);

      // Clear session ID error when user starts typing valid format
      if (errors.sessionId && value.length >= 3) {
        setErrors((prev) => ({ ...prev, sessionId: null }));
      }
    }
  };

  const handleStudentNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= VALIDATION_RULES.STUDENT_NAME.MAX_LENGTH) {
      setStudentName(value);

      // Clear name error when user starts typing
      if (errors.studentName && value.trim().length > 0) {
        setErrors((prev) => ({ ...prev, studentName: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate session ID
    if (!sessionId.trim()) {
      newErrors.sessionId = "Session ID is required";
    } else if (!validateSessionId(sessionId)) {
      newErrors.sessionId = "Invalid session ID format. Expected: VV-XXXXXX";
    }

    // Validate student name
    if (!studentName.trim()) {
      newErrors.studentName = "Your name is required";
    } else if (
      studentName.trim().length < VALIDATION_RULES.STUDENT_NAME.MIN_LENGTH
    ) {
      newErrors.studentName = "Name must be at least 1 character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Check if session exists and is active
      const response = await sessionService.getSessionById(sessionId);

      if (!response.success) {
        setErrors({ sessionId: response.message || "Failed to fetch session" });
        return;
      }

      const sessionData = response.data;

      if (!sessionData.isActive) {
        setErrors({ sessionId: "This session is not currently active" });
        return;
      }

      // Join the session
      actions.setCurrentSession(sessionData);
      actions.setStudentName(studentName.trim());
      actions.setSessionJoined(true);

      // You can add success toast/notification here
    } catch (error) {
      console.error("Failed to join session:", error);

      if (error.response?.status === 404) {
        setErrors({ sessionId: "Session not found. Please check the ID." });
      } else {
        setErrors({
          form: error.response?.data?.message || UI_MESSAGES.ERROR,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionJoinContainer>
      <Title>Join Session</Title>
      <Subtitle>
        Enter the session ID provided by your instructor to join the Q&A session
      </Subtitle>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="sessionId">Session ID</Label>
          <Input
            id="sessionId"
            type="text"
            value={sessionId}
            onChange={handleSessionIdChange}
            placeholder="Enter session ID (e.g., VV-ABC123)"
            hasError={!!errors.sessionId}
            disabled={isLoading}
          />
          {errors.sessionId && <ErrorMessage>{errors.sessionId}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="studentName">Your Name</Label>
          <Input
            id="studentName"
            type="text"
            value={studentName}
            onChange={handleStudentNameChange}
            placeholder="Enter your name"
            hasError={!!errors.studentName}
            disabled={isLoading}
          />
          {errors.studentName && (
            <ErrorMessage>{errors.studentName}</ErrorMessage>
          )}
        </InputGroup>

        {errors.form && (
          <ErrorMessage style={{ textAlign: "center" }}>
            {errors.form}
          </ErrorMessage>
        )}

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="white" />
              Joining Session...
            </>
          ) : (
            "Join Session"
          )}
        </SubmitButton>
      </Form>

      <HelpText>
        <strong>How to get a Session ID:</strong>
        <br />
        Ask your instructor for the current session ID. It should look like{" "}
        <ExampleId>VV-ABC123</ExampleId> or <ExampleId>VV-XYZ789</ExampleId>.
        <br />
        <br />
        The session must be active for you to join and post questions.
      </HelpText>
    </SessionJoinContainer>
  );
};

export default SessionJoin;
