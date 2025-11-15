import {React, useEffect, useState} from 'react';
import Course from '../components/Course.jsx';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar.jsx';
import Loading from '../components/Loading.jsx';
const Home = () => {
  // Sample course data
  // const enrolledCourses = [
  //   {
  //     id: 1,
  //     name: "Introduction to React",
  //     instructor: "Sarah Johnson",
  //     image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&auto=format"
  //   },
  //   {
  //     id: 2,
  //     name: "Advanced JavaScript",
  //     instructor: "Mike Chen",
  //     image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&auto=format"
  //   },
  //   {
  //     id: 3,
  //     name: "UI/UX Design Fundamentals",
  //     instructor: "Emily Rodriguez",
  //     image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop&auto=format"
  //   },
  //   {
  //     id: 4,
  //     name: "Python for Data Science",
  //     instructor: "David Kumar",
  //     image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&auto=format"
  //   },
  //   {
  //     id: 5,
  //     name: "Mobile App Development",
  //     instructor: "Lisa Park",
  //     image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&auto=format"
  //   },
  //   {
  //     id: 6,
  //     name: "Database Management",
  //     instructor: "James Wilson",
  //     image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop&auto=format"
  //   }
  // ];

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if(!user._id) return;
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await axios({
          method: 'GET',
          url: `http://localhost:3000/api/courses/${user._id}`,
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = response.data;
        console.log(data);
        setEnrolledCourses(data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
      finally{
        setLoading(false);
      }
    };
    
    fetchEnrolledCourses();
  }, [user]);

  

  return (
    
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />
      {loading ? <Loading /> :
      <>
       <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600 mt-1">Continue your learning journey</p>
            </div>
            <div className="text-sm text-gray-500">
              {enrolledCourses.length} courses enrolled
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrolledCourses.map((course) => (
            <Course key={course._id} course={course} />
          ))}
        </div>

        {/* Empty State (if no courses) */}
        {enrolledCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
            {/* <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
            <button className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
              Browse Courses
            </button> */}
          </div>
        )}
      </main>
      </>
    }
    </div>
  );
};

export default Home;