import { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";
import FilterPanel from "./FilterPanel";
import "./QuestionList.css";

const QuestionList = ({ questions, user, canModerate, onUpdateStatus }) => {
  const [filter, setFilter] = useState("unanswered");
  const [sortedQuestions, setSortedQuestions] = useState(questions);

  // Update sortedQuestions when questions prop changes
  useEffect(() => {
    setSortedQuestions(questions);
  }, [questions]);

  const filteredQuestions = sortedQuestions.filter((question) => {
    switch (filter) {
      case "unanswered":
        return question.status === "unanswered";
      case "answered":
        return question.status === "answered";
      case "important":
        return question.status === "important";
      case "archived":
        return question.status === "archived";
      default:
        return true;
    }
  });

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  const handleSort = (sortBy) => {
    const sorted = [...filteredQuestions].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortBy === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    setSortedQuestions(sorted);
  };

  return (
    <div className="question-list">
      <div className="question-list-header">
        <h2>
          Questions ({filteredQuestions.length})
          {filter !== "all" && (
            <span className="filter-indicator"> - Filter: {filter}</span>
          )}
        </h2>

        <FilterPanel
          filter={filter}
          onFilterChange={setFilter}
          onSort={handleSort}
          sortOptions={sortOptions}
        />
      </div>

      <div className="questions-container">
        {filteredQuestions.length === 0 ? (
          <div className="no-questions">
            <p>No questions yet</p>
            <p>Be the first to ask a question!</p>
          </div>
        ) : (
          <>
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort:</label>
              <select
                id="sort-select"
                onChange={(e) => handleSort(e.target.value)}
                defaultValue="newest"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="questions-grid">
              {filteredQuestions.map((question) => (
                <QuestionItem
                  key={question._id}
                  question={question}
                  user={user}
                  canModerate={canModerate}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
