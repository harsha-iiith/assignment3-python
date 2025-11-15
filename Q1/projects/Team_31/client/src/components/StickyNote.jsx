
import { updateQuestion } from '../services/api';
import './StickyNote.css';

const StickyNote = ({ question, isArchiveVisible }) => {
    const { _id, text = 'No text', author = 'Unknown', status, isImportant } = question || {};

    const handleMarkAnswered = async () => {
        try {
            await updateQuestion(_id, { status: 'answered' });
        } catch (error) {
            console.error("Failed to mark as answered:", error);
            alert("Could not update the question. Please try again.");
        }
    };

    const handleToggleImportant = async () => {
        try {
            await updateQuestion(_id, { isImportant: !isImportant });
        } catch (error) {
            console.error("Failed to mark as important:", error);
            alert("Could not update the question. Please try again.");
        }
    };

    const noteClasses = `sticky-note ${status === 'answered' ? 'answered' : ''} ${isImportant ? 'important' : ''}`;

    return (
        <div className={noteClasses}>
            {isImportant && <div className="important-badge">⭐</div>}
            <p className="sticky-note-text">{text}</p>
            <div className="sticky-note-footer">
                <span className="author-name">- {author}</span>
                <div className="note-actions">
                    <button onClick={handleToggleImportant}
                        title="Mark as Important"
                        disabled={isArchiveVisible}>
                        ⭐
                    </button>
                    <button onClick={handleMarkAnswered}
                        title="Mark as Answered"
                        disabled={status === 'answered' || isArchiveVisible}>
                        ✔️
                    </button>
                </div>
            </div>
        </div >
    );
};

export default StickyNote;
