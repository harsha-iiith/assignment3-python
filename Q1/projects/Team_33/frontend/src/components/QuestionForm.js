import { useState } from "react";
import "./QuestionForm.css";

const QuestionForm = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ text: text.trim() });
    } catch (error) {
      console.error("Error creating question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-form-container">
      <div className="question-form">
        <h3>Ask a Question</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="question-text">What's your question?</label>
            <textarea
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your question here..."
              required
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="button-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isSubmitting || !text.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
