import { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { addQuestion } from "../reducers/questions";
import DoubtModal from "./DoubtModal";
// import { useSelector } from "react-redux";

export default function Header({ activeView, onViewChange}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const questions = useSelector((state) => state.questions.questions);

  const [showModal, setShowModal] = useState(false);
  const [doubtText, setDoubtText] = useState("");
  
  const tabs = [
    { id: "kanban", label: "Kanban View" },
    { id: "unanswered", label: "Unanswered" },
    { id: "answered", label: "Answered" },
    { id: "important", label: "Important" },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.id === activeView);
  const lecture_name = useSelector((state) => state.questions.lecture_name);
  const course_name = useSelector((state) => state.course.name);
  // Handle doubt submission
  const handleSubmitDoubt = (doubt) => {
    // Create new question object
    const newQuestion = {
      questionId: questions.length + 1, // Simple ID generation
      _id: `q${questions.length + 1}`,
      question: doubt.trim(),
      authorName: user.name,
      authorId: user.id,
      status: "unanswered",
      createdOn: new Date().toISOString(),
    };

    // Dispatch to Redux store
    dispatch(addQuestion(newQuestion));
    
    // Reset form and close modal
    setDoubtText("");
    setShowModal(false);
    
    // You could show a success message here
    alert("Doubt submitted successfully!");
  };

  return (
    <>
      <header className="h-[10vh] bg-gradient-to-r from-slate-50 via-white to-slate-50 backdrop-blur-sm border-b border-slate-200/60 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {course_name} - {lecture_name}
          </h1>
        </div>

        {user.role === "instructor" && (
          <div
            className="relative bg-white/80 backdrop-blur-sm rounded-xl p-1.5 flex shadow-lg border border-slate-200/60"
            style={{ width: "36.5rem" }}
          >
            {/* Sliding active indicator */}
            <div
              className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg transition-all duration-300 ease-out shadow-md border border-indigo-400/20"
              style={{
                left: `calc(0.375rem + ${activeIndex * 9}rem)`,
                width: "9rem",
              }}
            />

            {/* Tab buttons */}
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={`relative z-10 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center cursor-pointer text-center ${
                  activeView === tab.id
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
                style={{
                  width: "9rem",
                  margin: 0,
                  padding: "0.625rem 0",
                  border: "none",
                  outline: "none",
                }}
              >
                <span className="block w-full text-center font-medium">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Ask Doubt Button for Students */}
        {user.role === "student" && (
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => setShowModal(true)}
            >
              Ask Doubt
            </button>
          </div>
        )}
      </header>

      {/* Ask Doubt Modal */}
      <DoubtModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        doubtText={doubtText}
        setDoubtText={setDoubtText}
        onSubmit={handleSubmitDoubt}
      />
    </>
  );
}
