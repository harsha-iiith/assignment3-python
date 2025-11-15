import React from "react";
import { useNavigate  } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setCourseDetails } from "../reducers/course.js";
const Course = ({ course }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const handleClick = () => {
      console.log()
        dispatch(setCourseDetails({
          name: course.name,
          _id: course._id,
          instructor_name: course.instructor.fname + " " + course.instructor.lname
        }));
        navigate('/course/' + course._id);
    }
    
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group">
      {/* Course Image */}
      {/* <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div> */}

      {/* Course Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Instructor: {course.instructor && course.instructor.fname ? course.instructor.fname : ""}
        </p>
        
        {/* Action Button */}
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium" onClick={handleClick}>
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default Course;