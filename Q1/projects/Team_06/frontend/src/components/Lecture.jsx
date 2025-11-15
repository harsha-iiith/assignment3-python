import { Play, Calendar, User, MessageCircleQuestion, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {setLecture} from "../reducers/questions";
import { useDispatch } from "react-redux";

const Lecture = ({ lecture}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onLectureClick = (lectureId, lectureName) => {
        console.log(lecture);
        dispatch(setLecture({ lecture_id: lectureId, lecture_name: lectureName }));
        navigate(`/doubts/${lectureId}`);
    }
    console.log(lecture);
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
      onClick={() => onLectureClick(lecture._id, lecture.name)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Play className="w-4 h-4 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
              {lecture.name}
            </h3>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {/* if empty date, show current date
               */}
              
              <span>{new Date(lecture.lectureDate || Date.now()).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            {/* <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{lecture.instructor}</span>
            </div> */}
            {/* <div className="text-gray-500">
              {lecture.duration}
            </div> */}
          </div>

          <div className="flex items-center text-sm text-blue-600 font-medium">
            <MessageCircleQuestion className="w-4 h-4 mr-1" />
            <span>{lecture.questions.length} questions asked</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
          <span className="text-sm mr-2">View Questions</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Lecture;