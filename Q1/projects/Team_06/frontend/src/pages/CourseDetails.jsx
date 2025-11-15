import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lecture from "../components/Lecture.jsx";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X, Calendar, Clock, User } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Loading from "../components/Loading.jsx";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user);
    const course = useSelector((state) => state.course);

    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                setLoading(true);
                const response = await axios({
                    method: 'GET',
                    url: `http://localhost:3000/api/${id}/lectures`,
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = response.data;
                // map lectures
                console.log(data);
                setLectures(data);
                console.log(course)
            } catch (error) {
                console.error("Error fetching lectures:", error);
            }
            finally{
                setLoading(false);
            }
        };
        fetchLectures();
    }, [])

    // // Modal state for adding new lecture
    const [showAddLectureModal, setShowAddLectureModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newLecture, setNewLecture] = useState({
        name: "",
        date: "",
        duration: "",
        description: ""
    });


    // Check if current user can add lectures (is instructor of this course)
    const canAddLectures = currentUser.role === "instructor";

    const onBackClick = () => {
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLecture(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddLecture = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!newLecture.name || !newLecture.date) {
            alert("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // setLoading(true);
            const response = await axios({
                method: 'POST',
                url: `http://localhost:3000/api/${id}/lectures`,
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    name: newLecture.name,
                    lectureDate: newLecture.date,
                }
            })

            const createdLecture = response.data;
            setLectures(prev => [...prev, createdLecture]);
            
            // Reset form and close modal
            setNewLecture({ name: ""});
            setShowAddLectureModal(false);
            
        } catch (error) {
            console.error('Error creating lecture:', error);
            alert("Failed to create lecture. Please try again.");
        } finally {
            // setLoading(false);
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowAddLectureModal(false);
        setNewLecture({ name: ""});
    };

    // Get today's date in YYYY-MM-DD format for date input min value
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Navbar />
        {loading ? <Loading />: 
            <>
            {/* Page Header - Course-specific content */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                    {/* <button
                        onClick={handleBackClick}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        <span className="hidden sm:inline">Back to Courses</span>
                    </button> */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{course?.name}</h1>
                        <p className="text-gray-600 mt-1">Instructor: {course?.instructor_name}</p>
                    </div>
                    </div>
                    
                    {/* Add Lecture Button */}
                    {canAddLectures && (
                    <button
                        onClick={() => setShowAddLectureModal(true)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lecture
                    </button>
                    )}
                </div>
                </div>
            </div>
            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Course Lectures</h2>
                    <p className="text-gray-600">
                        {canAddLectures 
                            ? "Manage your course lectures and click on any lecture to view questions" 
                            : "Click on any lecture to view questions asked by students"
                        }
                    </p>
                </div>

                {/* Lectures List */}
                <div className="space-y-4">
                    {lectures.length > 0 ? (
                        lectures.map((lecture) => (
                            <Lecture 
                                key={lecture._id} 
                                lecture={lecture} 
                                onLectureClick={(lectureId) => {
                                    navigate(`/courses/${id}/lectures/${lectureId}`);
                                }}
                                canEdit={canAddLectures} // Pass edit capability to Lecture component
                            />
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-gray-400 text-6xl mb-4">📹</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No lectures available</h3>
                            <p className="text-gray-600 mb-6">
                                {canAddLectures 
                                    ? "Start by adding your first lecture to this course." 
                                    : "Lectures will be added soon. Check back later!"
                                }
                            </p>
                            {canAddLectures && (
                                <button
                                    onClick={() => setShowAddLectureModal(true)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                                >
                                    Add First Lecture
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Lecture Modal */}
            {showAddLectureModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Lecture</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleAddLecture} className="p-6 space-y-4">
                            {/* Lecture Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Lecture Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newLecture.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Introduction to React Hooks"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            Date
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Lecture Date *
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={newLecture.date}
                                    onChange={handleInputChange}
                                    min={getTodayDate()}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Duration */}
                            {/* <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Duration *
                                </label>
                                <select
                                    id="duration"
                                    name="duration"
                                    value={newLecture.duration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select duration</option>
                                    <option value="30 min">30 minutes</option>
                                    <option value="45 min">45 minutes</option>
                                    <option value="60 min">1 hour</option>
                                    <option value="90 min">1.5 hours</option>
                                    <option value="120 min">2 hours</option>
                                </select>
                            </div> */}

                            {/* Description (Optional) */}
                            {/* <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newLecture.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of what will be covered in this lecture..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                />
                            </div> */}

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Lecture
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )};
        </>
        }
        </div>
    );
};

export default CourseDetails;