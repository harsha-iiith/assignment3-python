import './FilterToolbar.css';

const FilterToolbar = ({ activeFilter, onFilterChange, onClearBoard, onToggleArchive, isArchiveVisible }) => {
    return (
        <div className="filter-toolbar">
            <div className="filters">
                <button
                    className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange('all')}
                    disabled={isArchiveVisible}
                >
                    All Questions
                </button>
                <button
                    className={`filter-button ${activeFilter === 'unanswered' ? 'active' : ''}`}
                    onClick={() => onFilterChange('unanswered')}
                    disabled={isArchiveVisible}
                >
                    Unanswered
                </button>
                <button
                    className={`filter-button ${activeFilter === 'important' ? 'active' : ''}`}
                    onClick={() => onFilterChange('important')}
                    disabled={isArchiveVisible}
                >
                    Important
                </button>
            </div>
            <div className="actions">
                <button className="archive-button" onClick={onToggleArchive}>
                    {isArchiveVisible ? 'Show Live Board' : 'Show Archive'}
                </button>
                <button className="clear-board-button" onClick={onClearBoard} disabled={isArchiveVisible}>
                    Clear Board
                </button>
            </div>
        </div>
    );
};

export default FilterToolbar;

