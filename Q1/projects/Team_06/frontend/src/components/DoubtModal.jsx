import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addQuestion } from "../reducers/questions";

export default function DoubtModal({
  isOpen,
  onClose,
  doubtText,
  setDoubtText,
}) {
  const lectureId = useSelector((state) => state.questions.lecture_id);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Lecture ID in Modal:", lectureId);
  }, [lectureId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle modal backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const trimmedDoubtText = doubtText.trim();
    
    if (!trimmedDoubtText) {
      alert("Please enter a question before submitting.");
      return;
    }

    try {
      console.log("Submitting question to lecture:", lectureId);
      const response = await axios({
        method: "POST",
        url: `http://localhost:3000/api/getQues/${lectureId}`,
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        data: {
          quesObj: {
            content: trimmedDoubtText,
            status: "unanswered",
            authorId: user._id,
            authorName: user.name || user.fname || "Anonymous", // Use available name field
            createdAt: new Date().toISOString(),
            answeredAt: null,
            isPinned: false
          }
        },
      });
      
      const data = response.data;
      console.log("Question created:", data);
      
      // Create question object that matches the expected format
      const newQuestion = {
        questionId: data._id,
        question: data.content,
        authorName: data.authorName,
        authorId: data.authorId,
        status: data.status,
        createdOn: data.createdAt,
        answeredOn: data.answeredAt,
        isPinned: data.isPinned || false
      };
      
      // Use addQuestion instead of updateQuestion for new questions
      dispatch(addQuestion(newQuestion));
      
      // Reset form and close modal
      setDoubtText("");
      onClose();
      
    } catch (error) {

      console.error("Error submitting question:", error);
      alert(error.response.data.err || "An issue occured");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 w-full max-w-2xl mx-4 transform transition-all duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <h2 className="text-xl font-semibold text-slate-800">
            Ask Your Doubt
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <textarea
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="Type your question or doubt here..."
            className="w-full h-32 p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
            autoFocus
            maxLength={500}
          />

          {/* Character count */}
          <div className="mt-2 text-sm text-slate-500 text-right">
            {doubtText.length}/500 characters
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!doubtText.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Submit Doubt
          </button>
        </div>
      </div>
    </div>
  );
}