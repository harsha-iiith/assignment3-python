import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, User, Play, MessageCircleQuestion, ChevronRight, HelpCircle } from 'lucide-react';

// Course Component
const Course = ({ course, onCourseClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
      onClick={() => onCourseClick(course.id)}
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>

      {/* Course Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Instructor: {course.instructor}
        </p>
        
        {/* Action Button */}
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
          View Lectures
        </button>
      </div>
    </div>
  );
};

// Question Component
const Question = ({ question, index }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors duration-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600">Q{index + 1}</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium mb-2">{question.text}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>Asked by: {question.askedBy}</span>
            <span>•</span>
            <span>{question.timestamp}</span>
          </div>
          {question.answer && (
            <div className="mt-3 pl-4 border-l-2 border-green-200 bg-green-50 p-3 rounded-r-md">
              <p className="text-sm text-gray-700"><strong>Answer:</strong> {question.answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Lecture Component
const Lecture = ({ lecture, onLectureClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
      onClick={() => onLectureClick(lecture.id)}
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
              <span>{lecture.date}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{lecture.instructor}</span>
            </div>
            <div className="text-gray-500">
              {lecture.duration}
            </div>
          </div>

          <div className="flex items-center text-sm text-blue-600 font-medium">
            <MessageCircleQuestion className="w-4 h-4 mr-1" />
            <span>{lecture.questionCount} questions asked</span>
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

// Lecture Questions Page Component
const LectureQuestionsPage = ({ courseId, lectureId, onBackClick }) => {
  const [lecture, setLecture] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock function to fetch lecture details
  const fetchLectureDetails = async (courseId, lectureId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockLectures = {
      1: {
        1: { id: 1, name: "Introduction to React and Components", date: "2024-01-15", instructor: "Sarah Johnson" },
        2: { id: 2, name: "JSX and Props Deep Dive", date: "2024-01-18", instructor: "Sarah Johnson" },
        3: { id: 3, name: "State Management with useState", date: "2024-01-22", instructor: "Sarah Johnson" }
      },
      2: {
        1: { id: 1, name: "Advanced ES6+ Features", date: "2024-02-01", instructor: "Mike Chen" },
        2: { id: 2, name: "Asynchronous JavaScript and Promises", date: "2024-02-05", instructor: "Mike Chen" }
      }
    };
    
    return mockLectures[courseId]?.[lectureId] || null;
  };

  // Mock function to fetch questions for a lecture
  const fetchLectureQuestions = async (courseId, lectureId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockQuestions = {
      1: {
        1: [
          {
            id: 1,
            text: "What's the difference between functional and class components in React?",
            askedBy: "John Doe",
            timestamp: "10:15 AM",
            answer: "Functional components are simpler and use hooks for state management, while class components use lifecycle methods and this.state."
          },
          {
            id: 2,
            text: "Can you explain how props are passed down to child components?",
            askedBy: "Jane Smith",
            timestamp: "10:32 AM",
            answer: "Props are passed as attributes to JSX elements and received as parameters in functional components or this.props in class components."
          },
          {
            id: 3,
            text: "How do we handle events in React components?",
            askedBy: "Mike Johnson",
            timestamp: "10:45 AM",
            answer: null
          }
        ],
        2: [
          {
            id: 1,
            text: "What is JSX and how is it different from regular JavaScript?",
            askedBy: "Sarah Wilson",
            timestamp: "11:20 AM",
            answer: "JSX is a syntax extension that allows you to write HTML-like code in JavaScript. It gets transpiled to React.createElement calls."
          },
          {
            id: 2,
            text: "Can we use JavaScript expressions inside JSX?",
            askedBy: "Tom Brown",
            timestamp: "11:35 AM",
            answer: "Yes, you can use JavaScript expressions inside curly braces {} in JSX."
          }
        ]
      }
    };
    
    return mockQuestions[courseId]?.[lectureId] || [];
  };

  useEffect(() => {
    const loadLectureData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [lectureData, questionsData] = await Promise.all([
          fetchLectureDetails(courseId, lectureId),
          fetchLectureQuestions(courseId, lectureId)
        ]);
        
        if (!lectureData) {
          throw new Error('Lecture not found');
        }
        
        setLecture(lectureData);
        setQuestions(questionsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLectureData();
  }, [courseId, lectureId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lecture questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={onBackClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Lectures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={onBackClick}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Lectures
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{lecture.name}</h1>
              <div className="flex items-center text-gray-600 mt-1 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{lecture.date}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{lecture.instructor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <MessageCircleQuestion className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Questions Asked in This Lecture</h2>
          </div>
          <p className="text-gray-600">{questions.length} questions from students</p>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <Question key={question.id} question={question} index={index} />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">
                <HelpCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600">No questions were asked during this lecture.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Course Details Page Component
const CourseDetailsPage = ({ courseId, onBackClick, onLectureClick }) => {
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseDetails = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const courses = {
      1: { id: 1, name: "Introduction to React", instructor: "Sarah Johnson" },
      2: { id: 2, name: "Advanced JavaScript", instructor: "Mike Chen" },
      3: { id: 3, name: "UI/UX Design Fundamentals", instructor: "Emily Rodriguez" },
      4: { id: 4, name: "Python for Data Science", instructor: "David Kumar" },
      5: { id: 5, name: "Mobile App Development", instructor: "Lisa Park" },
      6: { id: 6, name: "Database Management", instructor: "James Wilson" }
    };
    
    return courses[id] || null;
  };

  const fetchLectures = async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLectures = {
      1: [
        { id: 1, name: "Introduction to React and Components", date: "2024-01-15", instructor: "Sarah Johnson", duration: "45 min", questionCount: 3 },
        { id: 2, name: "JSX and Props Deep Dive", date: "2024-01-18", instructor: "Sarah Johnson", duration: "50 min", questionCount: 2 },
        { id: 3, name: "State Management with useState", date: "2024-01-22", instructor: "Sarah Johnson", duration: "60 min", questionCount: 0 },
        { id: 4, name: "Event Handling in React", date: "2024-01-25", instructor: "Sarah Johnson", duration: "40 min", questionCount: 1 },
        { id: 5, name: "Working with Forms", date: "2024-01-29", instructor: "Sarah Johnson", duration: "55 min", questionCount: 4 }
      ],
      2: [
        { id: 1, name: "Advanced ES6+ Features", date: "2024-02-01", instructor: "Mike Chen", duration: "65 min", questionCount: 2 },
        { id: 2, name: "Asynchronous JavaScript and Promises", date: "2024-02-05", instructor: "Mike Chen", duration: "70 min", questionCount: 5 },
        { id: 3, name: "Closures and Scope", date: "2024-02-08", instructor: "Mike Chen", duration: "50 min", questionCount: 1 },
        { id: 4, name: "Prototypes and Inheritance", date: "2024-02-12", instructor: "Mike Chen", duration: "60 min", questionCount: 3 }
      ]
    };
    
    return mockLectures[courseId] || [];
  };

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [courseData, lecturesData] = await Promise.all([
          fetchCourseDetails(courseId),
          fetchLectures(courseId)
        ]);
        
        if (!courseData) {
          throw new Error('Course not found');
        }
        
        setCourse(courseData);
        setLectures(lecturesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Course</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={onBackClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={onBackClick}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Courses
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-gray-600 mt-1">Instructor: {course.instructor}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Course Lectures</h2>
          <p className="text-gray-600">Click on any lecture to view questions asked by students</p>
        </div>

        {/* Lectures List */}
        <div className="space-y-4">
          {lectures.length > 0 ? (
            lectures.map((lecture) => (
              <Lecture 
                key={lecture.id} 
                lecture={lecture} 
                onLectureClick={(lectureId) => onLectureClick(courseId, lectureId)}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📹</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No lectures available</h3>
              <p className="text-gray-600">Lectures will be added soon. Check back later!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLectureId, setSelectedLectureId] = useState(null);

  const enrolledCourses = [
    {
      id: 1,
      name: "Introduction to React",
      instructor: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&auto=format"
    },
    {
      id: 2,
      name: "Advanced JavaScript",
      instructor: "Mike Chen",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&auto=format"
    },
    {
      id: 3,
      name: "UI/UX Design Fundamentals",
      instructor: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop&auto=format"
    },
    {
      id: 4,
      name: "Python for Data Science",
      instructor: "David Kumar",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&auto=format"
    },
    {
      id: 5,
      name: "Mobile App Development",
      instructor: "Lisa Park",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&auto=format"
    },
    {
      id: 6,
      name: "Database Management",
      instructor: "James Wilson",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop&auto=format"
    }
  ];

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    setCurrentPage('courseDetails');
  };

  const handleLectureClick = (courseId, lectureId) => {
    setSelectedCourseId(courseId);
    setSelectedLectureId(lectureId);
    setCurrentPage('lectureQuestions');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCourseId(null);
    setSelectedLectureId(null);
  };

  const handleBackToLectures = () => {
    setCurrentPage('courseDetails');
    setSelectedLectureId(null);
  };

  if (currentPage === 'lectureQuestions') {
    return (
      <LectureQuestionsPage 
        courseId={selectedCourseId}
        lectureId={selectedLectureId}
        onBackClick={handleBackToLectures} 
      />
    );
  }

  if (currentPage === 'courseDetails') {
    return (
      <CourseDetailsPage 
        courseId={selectedCourseId} 
        onBackClick={handleBackToHome}
        onLectureClick={handleLectureClick}
      />
    );
  }

  // Home Page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600 mt-1">Continue your learning journey</p>
            </div>
            <div className="text-sm text-gray-500">
              {enrolledCourses.length} courses enrolled
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrolledCourses.map((course) => (
            <Course 
              key={course.id} 
              course={course} 
              onCourseClick={handleCourseClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {enrolledCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
            <button className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
              Browse Courses
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;