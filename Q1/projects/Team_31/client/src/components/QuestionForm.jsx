import React, { useState } from 'react';
import { createQuestion } from '../services/api';
import './QuestionForm.css';

const QuestionForm = ({ isArchiveVisible }) => {
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!text.trim() || !author.trim()) {
            alert('Please enter both your name and a question!');
            return;
        }

        setSubmitting(true);
        try {
            await createQuestion({ author, text });
            setAuthor('');
            setText('');
        } catch (error) {
            console.error("Failed to submit question:", error);
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="question-form" onSubmit={handleSubmit}>
            <h2>{isArchiveVisible ? 'Viewing Archive' : 'Got a Question?'}</h2>
            {isArchiveVisible && (
                <p className="archive-notice">
                    New questions cannot be submitted while viewing the archive.
                </p>
            )}
            <div className="form-row">
                <input
                    type="text"
                    placeholder="Your Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="form-input"
                    disabled={submitting || isArchiveVisible}
                />
            </div>
            <div className="form-row">
                <textarea
                    placeholder="Ask your question here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="form-textarea"
                    disabled={submitting || isArchiveVisible}
                />
            </div>
            <button type="submit" className="submit-button" disabled={submitting || isArchiveVisible}>
                {submitting ? 'Posting...' : 'Post Question'}
            </button>
        </form>
    );
};

export default QuestionForm;
