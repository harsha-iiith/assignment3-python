import "./FilterPanel.css";

const FilterPanel = ({ filter, onFilterChange }) => {
  const filterOptions = [
    { value: "all", label: "All Questions" },
    { value: "unanswered", label: "Unanswered" },
    { value: "answered", label: "Answered" },
    { value: "important", label: "Important" },
    { value: "archived", label: "Cleared" },
  ];

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label htmlFor="filter-select">Filter:</label>
        <select
          id="filter-select"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-select"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
