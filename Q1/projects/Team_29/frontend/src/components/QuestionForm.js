import React, { useState } from 'react';

const QuestionForm = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <h3>Ask a New Question</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your question..."
        required
      />
      <button type="submit">Submit Question</button>
    </form>
  );
};

export default QuestionForm;