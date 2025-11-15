import { useDispatch, useSelector } from "react-redux";
import { updateQuestionStatus, updateQuestionPin, deleteQuestion } from "../reducers/questions";
import ActionButtons from "./ActionButtons";
import axios from "axios";

const ACCENT_KEYS = [
  "pink", "purple", "red", "blue", "fuchsia", 
  "rose", "violet", "cyan", "sky", "teal",
];

const ACCENTS = {
  pink: {
    border: "border-pink-100",
    topBorder: "border-t-4 border-t-pink-300",
    background: "bg-pink-100",
    questionText: "text-pink-900",
    sectionBorder: "border-t-[0.5px] border-pink-600",
    section: "bg-pink-100 text-pink-800",
  },
  purple: {
    border: "border-purple-100",
    topBorder: "border-t-4 border-t-purple-300",
    background: "bg-purple-100",
    questionText: "text-purple-900",
    sectionBorder: "border-t-[0.5px] border-purple-600",
    section: "bg-purple-100 text-purple-800",
  },
  red: {
    border: "border-red-100",
    topBorder: "border-t-4 border-t-red-300",
    background: "bg-red-100",
    questionText: "text-red-900",
    sectionBorder: "border-t-[0.5px] border-red-600",
    section: "bg-red-100 text-red-800",
  },
  blue: {
    border: "border-blue-100",
    topBorder: "border-t-4 border-t-blue-300",
    background: "bg-blue-100",
    questionText: "text-blue-900",
    sectionBorder: "border-t-[0.5px] border-blue-600",
    section: "bg-blue-100 text-blue-800",
  },
  fuchsia: {
    border: "border-fuchsia-100",
    topBorder: "border-t-4 border-t-fuchsia-300",
    background: "bg-fuchsia-100",
    questionText: "text-fuchsia-900",
    sectionBorder: "border-t-[0.5px] border-fuchsia-600",
    section: "bg-fuchsia-100 text-fuchsia-800",
  },
  rose: {
    border: "border-rose-100",
    topBorder: "border-t-4 border-t-rose-300",
    background: "bg-rose-100",
    questionText: "text-rose-900",
    sectionBorder: "border-t-[0.5px] border-rose-600",
    section: "bg-rose-100 text-rose-800",
  },
  violet: {
    border: "border-violet-100",
    topBorder: "border-t-4 border-t-violet-300",
    background: "bg-violet-100",
    questionText: "text-violet-900",
    sectionBorder: "border-t-[0.5px] border-violet-600",
    section: "bg-violet-100 text-violet-800",
  },
  cyan: {
    border: "border-cyan-100",
    topBorder: "border-t-4 border-t-cyan-300",
    background: "bg-cyan-100",
    questionText: "text-cyan-900",
    sectionBorder: "border-t-[0.5px] border-cyan-600",
    section: "bg-cyan-100 text-cyan-800",
  },
  sky: {
    border: "border-sky-100",
    topBorder: "border-t-4 border-t-sky-300",
    background: "bg-sky-100",
    questionText: "text-sky-900",
    sectionBorder: "border-t-[0.5px] border-sky-600",
    section: "bg-sky-100 text-sky-800",
  },
  teal: {
    border: "border-teal-100",
    topBorder: "border-t-4 border-t-teal-300",
    background: "bg-teal-100",
    questionText: "text-teal-900",
    sectionBorder: "border-t-[0.5px] border-teal-600",
    section: "bg-teal-100 text-teal-800",
  },
};

function pickAccentKey(keySource) {
  const s = String(keySource ?? "");
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum = (sum + s.charCodeAt(i)) % 1024;
  return ACCENT_KEYS[sum % ACCENT_KEYS.length];
}

function truncate(str, n = 12) {
  if (str == null) return "";
  return String(str).slice(0, n);
}

export default function Card({ item, isGridView = false }) {
  const dispatch = useDispatch();
  const accentKey = pickAccentKey(item.questionId || item.question);
  const accent = ACCENTS[accentKey];
  const user = useSelector((state) => state.user);
  const lectureId = useSelector((state) => state.questions.lecture_id);
  const handleDelete = async () => {
    try {
      console.log("Deleting question:", item);
      const response = await axios({
        method: "POST", // Use DELETE method for deletion
        url: `http://localhost:3000/api/deleteQues/${item.questionId}`,
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        data:{
          lectureId: lectureId
        }
      });
      
      console.log("Delete response:", response.data);
      dispatch(deleteQuestion(item.questionId));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const handleAnswered = async () => {
    const newStatus = item.status === "answered" ? "unanswered" : "answered";
    
    try {
      console.log("Updating question status:", item.questionId, newStatus);
      const response = await axios({
        method: "POST", // Use PATCH for updates
        url: `http://localhost:3000/api/updateQues/${item.questionId}`,
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        data: { 
          status: newStatus,
          answeredAt: newStatus === "answered" ? new Date().toISOString() : null
        },
      });
      
      console.log("Status update response:", response.data);
      dispatch(updateQuestionStatus({ 
        questionId: item.questionId, 
        status: newStatus,
        answeredOn: newStatus === "answered" ? new Date().toISOString() : null
      }));
    } catch (err) {
      console.error("Error updating question status:", err);
    }
  };

  const handleImportant = async () => {
    const newPinnedStatus = !item.isPinned;
    
    try {
      console.log("Updating question pin status:", item.questionId, newPinnedStatus);
      const response = await axios({
        method: "POST", // Use PATCH for updates
        url: `http://localhost:3000/api/pinnedQues/${item.questionId}`,
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        data: { 
          isPinned: newPinnedStatus 
        },
      });
      
      console.log("Pin update response:", response.data);
      dispatch(updateQuestionPin({ 
        questionId: item.questionId, 
        isPinned: newPinnedStatus 
      }));
    } catch (err) {
      console.error("Error updating question pin status:", err);
    }
  };

  return (
    <div
      className={`overflow-hidden w-full flex flex-col rounded-2xl border shadow-sm ${
        accent.background
      } ${accent.border} ${isGridView ? "h-64" : ""}`}
      role="group"
      aria-label="kanban-card"
    >
      {/* Question */}
      <section
        className={`flex-1 p-4 overflow-auto min-h-0 ${accent.background}`}
      >
        <p className={`text-base leading-snug ${accent.questionText}`}>
          {item.question}
        </p>
      </section>

      {/* Action section - only show for instructors */}
      
        <section
          className={`h-14 flex-shrink-0 px-4 py-2 text-xs flex items-center justify-between ${accent.section}`}
        >
          <div className="min-w-0 flex flex-col justify-start items-start">
            <span className="truncate">by {truncate(item.authorName, 20)}</span>
            <div className="flex gap-1 mt-1">
              {item.status === "answered" && (
                <span className="text-[10px] bg-green-200 text-green-800 px-1 py-0.5 rounded">
                  Answered
                </span>
              )}
              {item.isPinned && (
                <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded">
                  Pinned
                </span>
              )}
            </div>
          </div>
        {user.role === "instructor" && (
          <ActionButtons
            accentKey={accentKey}
            status={item.status}
            isPinned={item.isPinned}
            onDelete={handleDelete}
            onAnswered={handleAnswered}
            onImportant={handleImportant}
          />
        
      )}
      </section>
    </div>
  );
}