import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetQuestions, setQuestions, updateQuestion } from "../reducers/questions";
import { demoData } from "../data";
import Card from "../components/Card";
import Header from "../components/Header";
import socket from "../socket";
import axios from "axios";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

function Column({ title, items = [] }) {
  return (
    <div className="min-w-0 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col border border-white/30 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
        {items.map((it) => (
          <Card key={it.questionId} item={it} />
        ))}
      </div>
    </div>
  );
}

function SingleViewContainer({ title, items = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [title, items.length]);

  return (
    <div className="h-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {items.length} questions
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 scrollbar-hide"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {items.map((item) => (
            <Card key={item.questionId} item={item} isGridView={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Doubts() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions.questions);
  const user = useSelector((state) => state.user);
  const lectureId = useSelector((state) => state.questions.lecture_id);
  const [activeView, setActiveView] = useState("kanban");
  const [isLoading, setIsLoading] = useState(true);
  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      if (!lectureId || !user.token) return;

      try {
        setIsLoading(true);
        const response = await axios({
          method: 'GET',
          url: `http://localhost:3000/api/getQues/${lectureId}`,
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        const data = response.data;
        console.log("Loaded questions:", data);
        
        const questions = data.questions.map((q) => ({
          questionId: q._id,
          question: q.content,
          authorName: q.authorName,
          authorId: q.authorId,
          status: q.status, // "answered" or "unanswered"
          createdOn: q.createdAt ? q.createdAt : new Date().toISOString(),
          answeredOn: q.answeredAt ? q.answeredAt : null,
          isPinned: q.isPinned || false // separate field for importance
        }));
        
        dispatch(setQuestions(questions));
      } catch (error) {
        console.error("Error loading questions:", error);
      }
      finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [lectureId, user.token, dispatch]);

  // Fixed filter functions - now properly separate status and isPinned
  const getFilteredData = (filterType) => {
    switch (filterType) {
      case "unanswered":
        // Only questions that are unanswered (regardless of pin status)
        return questions.filter((item) => item.status === "unanswered");
      
      case "answered":
        // Only questions that are answered AND not pinned (to avoid duplicates with important)
        return questions.filter((item) => item.status === "answered" && !item.isPinned);
      
      case "important":
        // Only pinned questions (regardless of answered status)
        return questions.filter((item) => item.isPinned === true);
      
      case "userasked":
        // Questions asked by current user
        return questions.filter((item) => item.authorId === user._id);
      
      case "all":
        // All questions that are not pinned (to avoid duplicates)
        return questions.filter((item) => !item.isPinned);
      
      default:
        return questions;
    }
  };

  const renderContent = () => {
    if (user.role === "student") {
      return (
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column title="Your Doubts" items={getFilteredData("userasked")} />
          <Column title="All Questions" items={getFilteredData("all")} />
          <Column title="Important" items={getFilteredData("important")} />
        </div>
      );
    }

    // Instructor view
    switch (activeView) {
      case "kanban":
        return (
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <Column title="Unanswered" items={getFilteredData("unanswered")} />
            <Column title="Answered" items={getFilteredData("answered")} />
            <Column title="Important" items={getFilteredData("important")} />
          </div>
        );
      case "unanswered":
        return (
          <SingleViewContainer
            title="Unanswered Questions"
            items={getFilteredData("unanswered")}
          />
        );
      case "answered":
        return (
          <SingleViewContainer
            title="Answered Questions"
            items={getFilteredData("answered")}
          />
        );
      case "important":
        return (
          <SingleViewContainer
            title="Important Questions"
            items={getFilteredData("important")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
      <Navbar />
      {isLoading ? <Loading />:
      <>
      <Header activeView={activeView} onViewChange={setActiveView} />
      <main className="h-[90vh] p-6 overflow-hidden">{renderContent()}</main>
      </>
      }
      
    </div>
  );
}