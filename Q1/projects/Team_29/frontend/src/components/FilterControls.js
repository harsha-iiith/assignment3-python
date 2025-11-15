// frontend/src/components/FilterControls.js
import React from 'react';

const FilterControls = ({ setFilter, onClear }) => {
  return (
    <div className="filter-controls">
      <h3>Instructor Controls</h3>
      <button onClick={() => setFilter('')}>Show All</button>
      <button onClick={() => setFilter('unanswered')}>Show Unanswered</button>
      <button onClick={() => setFilter('answered')}>Show Answered</button>
      <button onClick={() => setFilter('important')}>Show Important</button>
      <button className="clear-btn" onClick={onClear}>Clear All Questions</button>
    </div>
  );
};

export default FilterControls;