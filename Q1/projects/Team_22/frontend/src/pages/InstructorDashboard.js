import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { Container } from "../styles/GlobalStyles";
import { useApp } from "../context/AppContext";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CourseSelector from "../components/instructor/CourseSelector";
import SessionManager from "../components/instructor/SessionManager";
import QuestionFilters from "../components/instructor/QuestionFilters";
import StudentGrid from "../components/instructor/StudentGrid";
import { getSessionQuestionsByStudent } from "../services/questionService";
import { updateQuestionStatus } from "../services/questionService";
import { copyToClipboard } from "../utils/helpers";
import { POLLING_INTERVAL } from "../utils/constants";
import { deleteQuestion } from "../services/questionService";

const DashboardContainer = styled.div`
	min-height: 100vh;
	background: ${theme.colors.background};
`;

const DashboardContent = styled.div`
	padding: ${theme.spacing[6]} 0;
`;

const Section = styled.section`
	margin-bottom: ${theme.spacing[8]};
`;

const SectionTitle = styled.h2`
	margin-bottom: ${theme.spacing[6]};
	color: ${theme.colors.text};
`;

const StepIndicator = styled.div`
	display: flex;
	align-items: center;
	gap: ${theme.spacing[4]};
	margin-bottom: ${theme.spacing[6]};
	padding: ${theme.spacing[4]};
	background: ${theme.colors.surface};
	border-radius: ${theme.borderRadius.lg};
	box-shadow: ${theme.shadows.sm};
`;

const Step = styled.div`
	display: flex;
	align-items: center;
	gap: ${theme.spacing[2]};
	padding: ${theme.spacing[2]} ${theme.spacing[4]};
	border-radius: ${theme.borderRadius.md};
	font-weight: ${theme.fontWeights.medium};

	${(props) => {
		if (props.completed) {
			return `
        background: ${theme.colors.success}20;
        color: ${theme.colors.success};
      `;
		} else if (props.current) {
			return `
        background: ${theme.colors.primary}20;
        color: ${theme.colors.primary};
      `;
		} else {
			return `
        background: ${theme.colors.background};
        color: ${theme.colors.muted};
      `;
		}
	}}

	.step-number {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: ${theme.fontSizes.sm};
		font-weight: ${theme.fontWeights.bold};
		background: currentColor;
		color: white;
	}
`;

const InstructorDashboard = () => {
	const { state, actions } = useApp();
	const { currentCourse, currentSession, filters } = state;

	const [questions, setQuestions] = useState([]);
	const [questionCounts, setQuestionCounts] = useState({
		total: 0,
		answered: 0,
		unanswered: 0,
		important: 0,
	});
	const [loading, setLoading] = useState(false);
	const [pollingInterval, setPollingInterval] = useState(null);

	// Load questions when session changes or filters change
	useEffect(() => {
		if (currentSession) {
			loadQuestions();
			startPolling();
		} else {
			setQuestions([]);
			setQuestionCounts({ total: 0, answered: 0, unanswered: 0, important: 0 });
			stopPolling();
		}

		return () => stopPolling();
	}, [currentSession, filters.status, filters.student]);

	const startPolling = () => {
		stopPolling(); // Clear any existing interval

		const interval = setInterval(() => {
			if (currentSession) {
				loadQuestions(false); // Load without showing loading spinner
			}
		}, POLLING_INTERVAL);

		setPollingInterval(interval);
	};

	const stopPolling = () => {
		if (pollingInterval) {
			clearInterval(pollingInterval);
			setPollingInterval(null);
		}
	};

	const loadQuestions = async (showLoading = true) => {
		if (!currentSession) return;

		if (showLoading) setLoading(true);

		try {
			const params = {};
			if (filters.status !== "all") params.status = filters.status;
			if (filters.student) params.student = filters.student;

			const response = await getSessionQuestionsByStudent(
				currentSession.sessionId,
				params
			);

			if (response.success) {
				const questionsArray = [];
				const questionsByStudent = response.data.questionsByStudent || {};

				// Flatten questions from grouped data
				Object.values(questionsByStudent).forEach((studentQuestions) => {
					questionsArray.push(...studentQuestions);
				});

				setQuestions(questionsArray);

				// Calculate question counts
				const counts = {
					total: questionsArray.length,
					answered: questionsArray.filter((q) => q.isAnswered).length,
					unanswered: questionsArray.filter((q) => !q.isAnswered).length,
					important: questionsArray.filter((q) => q.isImportant).length,
				};
				setQuestionCounts(counts);

				// Update global state
				actions.setQuestions(questionsArray);
				actions.setQuestionsByStudent(questionsByStudent);
			} else {
				console.error("Failed to load questions:", response.message);
			}
		} catch (error) {
			console.error("Error loading questions:", error);
		} finally {
			if (showLoading) setLoading(false);
		}
	};

	const handleCourseSelect = (course) => {
		actions.setCurrentCourse(course);
	};

	const handleSessionStart = (session) => {
		actions.setCurrentSession(session);
	};

	const handleSessionEnd = () => {
		actions.clearSession();
		stopPolling();
	};

	const handleCopySessionId = async (sessionId) => {
		const success = await copyToClipboard(sessionId);
		if (success) {
			actions.setSuccess("Session ID copied to clipboard!");
		} else {
			actions.setError("Failed to copy session ID");
		}
	};

	const handleQuestionStatusChange = async (questionId, action) => {
		try {
			const response = await updateQuestionStatus(questionId, { action });

			if (response.success) {
				// Update the question in local state
				setQuestions((prev) =>
					prev.map((q) =>
						q._id === questionId ? { ...q, ...response.data } : q
					)
				);

				// Update global state
				actions.updateQuestion(response.data);

				// Refresh counts
				loadQuestions(false);
			} else {
				actions.setError(
					response.message || "Failed to update question status"
				);
			}
		} catch (error) {
			actions.setError("Failed to update question status");
			console.error("Error updating question status:", error);
		}
	};

	const handleQuestionClick = (question) => {
		// Could open a modal with full question details
		console.log("Question clicked:", question);
	};

	const handleDeleteQuestion = async (questionId) => {
		try {
			const response = await deleteQuestion(questionId);
			console.log("Delete response:", response);

			if (response.success) {
				// Remove locally
				setQuestions((prev) => prev.filter((q) => q._id !== questionId));
				// Remove globally
				actions.removeQuestion(questionId);
			} else {
				actions.setError(response.message || "Failed to delete question");
			}
		} catch (error) {
			console.error("Error deleting question:", error);
			actions.setError("Failed to delete question");
		}
	};

	// Determine current step for progress indicator
	const getCurrentStep = () => {
		if (currentSession) return 3;
		if (currentCourse) return 2;
		return 1;
	};

	const currentStep = getCurrentStep();

	return (
		<DashboardContainer>
			<Header
				userRole="instructor"
				currentSession={currentSession}
				currentCourse={currentCourse}
				onRoleChange={actions.resetApp}
				onSessionEnd={handleSessionEnd}
				onCopySessionId={handleCopySessionId}
			/>

			<Container>
				<DashboardContent>
					<StepIndicator>
						<Step completed={currentStep > 1} current={currentStep === 1}>
							<div className="step-number">1</div>
							<span>Select Course</span>
						</Step>
						<div>→</div>
						<Step completed={currentStep > 2} current={currentStep === 2}>
							<div className="step-number">2</div>
							<span>Start Session</span>
						</Step>
						<div>→</div>
						<Step completed={false} current={currentStep === 3}>
							<div className="step-number">3</div>
							<span>Manage Questions</span>
						</Step>
					</StepIndicator>

					{!currentCourse && (
						<Section>
							<CourseSelector
								selectedCourse={currentCourse}
								onCourseSelect={handleCourseSelect}
							/>
						</Section>
					)}

					{currentCourse && (
						<Section>
							<SessionManager
								course={currentCourse}
								currentSession={currentSession}
								onSessionStart={handleSessionStart}
								onSessionEnd={handleSessionEnd}
								onError={actions.setError}
								onSuccess={actions.setSuccess}
							/>
						</Section>
					)}

					{currentSession && (
						<>
							<Section>
								<SectionTitle>Question Management</SectionTitle>
								<QuestionFilters
									statusFilter={filters.status}
									studentFilter={filters.student}
									onStatusFilterChange={actions.setStatusFilter}
									onStudentFilterChange={actions.setStudentFilter}
									onClearFilters={actions.clearFilters}
									questionCounts={questionCounts}
								/>
							</Section>

							<Section>
								<SectionTitle>
									Student Questions
									{questions.length > 0 && ` (${questions.length})`}
								</SectionTitle>

								{loading ? (
									<LoadingSpinner text="Loading questions..." />
								) : (
									<StudentGrid
										questions={questions}
										onQuestionStatusChange={handleQuestionStatusChange}
										onQuestionClick={handleQuestionClick}
										onQuestionDelete={handleDeleteQuestion}
										statusFilter={filters.status}
										studentFilter={filters.student}
									/>
								)}
							</Section>
						</>
					)}
				</DashboardContent>
			</Container>
		</DashboardContainer>
	);
};

export default InstructorDashboard;
