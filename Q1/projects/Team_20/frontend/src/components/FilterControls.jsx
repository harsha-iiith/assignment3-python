import React from 'react';

const FilterControls = ({ filter, onFilterChange, questions }) => {
  const filters = [
    { value: 'all', label: 'All Questions', count: questions.length },
    { value: 'unanswered', label: 'Unanswered', count: questions.filter(q => q.status === 'Unanswered').length },
    { value: 'answered', label: 'Answered', count: questions.filter(q => q.status === 'Answered').length },
    { value: 'important', label: 'Important', count: questions.filter(q => q.isImportant).length },
  ];



  return (
    <div className="filter-controls">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Filter Questions</h3>
        <div className="filter-buttons">
          {filters.map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => onFilterChange(filterOption.value)}
              className={`filter-btn ${filter === filterOption.value ? 'active' : ''}`}
            >
              {filterOption.label}
              <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                ({filterOption.count})
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FilterControls;
