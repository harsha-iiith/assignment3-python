import StickyNote from './StickyNote';
import './QuestionBoard.css';

const QuestionBoard = ({ questions, loading, error, isArchiveVisible }) => {
    if (loading) {
        return <div className="board-container"><p className="loading-state">Loading questions...</p></div>;
    }

    if (error) {
        return <div className="board-container"><p className="error-state">{error}</p></div>;
    }

    if (questions.length === 0) {
        return (
            <div className="board-container">
                <div className="empty-state">
                    <h3>{isArchiveVisible ? 'The Archive is Empty' : 'No Questions Match Your Filter'}</h3>
                    <p>{isArchiveVisible ? 'Archived questions will appear here for later review.' : 'Try selecting a different filter or be the first to ask a question!'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="board-container">
            {questions.map(question => (
                <StickyNote
                    key={question._id}
                    question={question}
                    isArchiveVisible={isArchiveVisible}
                />
            ))}
        </div>
    );
};

export default QuestionBoard;

