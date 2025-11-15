import { useState } from "react";
import "./QuestionItem.css";

const QuestionItem = ({ question, user, canModerate, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (!canModerate) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(question._id, newStatus);
    } catch (error) {
      console.error("Error updating question status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "#28a745";
      case "important":
        return "#fd7e14";
      case "archived":
        return "#6c757d";
      case "unanswered":
      default:
        return "#dc3545";
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="question-item" data-status={question.status}>
      <div className="question-header">
        <div className="question-status">
          <span className="status-badge">{getStatusText(question.status)}</span>
        </div>

        {canModerate && (
          <div className="question-actions">
            <select
              value={question.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="status-select"
            >
              <option value="unanswered">Unanswered</option>
              <option value="answered">Answered</option>
              <option value="important">Important</option>
              <option value="archived">Clear</option>
            </select>
          </div>
        )}
      </div>

      <div className="question-content">
        <p className="question-text">{question.text}</p>
      </div>

      <div className="question-footer">
        <div className="question-meta">
          <span className="question-author">
            {question.author?.name || question.author?.email || "Anonymous"}
          </span>
          <span className="question-time">
            {getTimeAgo(question.createdAt)}
          </span>
        </div>
        <div className="question-details">
          <span className="question-date">
            {new Date(question.createdAt).toLocaleDateString()} at{" "}
            {new Date(question.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
