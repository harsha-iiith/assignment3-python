import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Sidebar } from './Sidebar.jsx';
import { 
  MessageCircle, 
  Star,
  Check,
  StopCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

// API helper functions
const API_BASE_URL = 'http://localhost:5001/api';

const getAuthToken = () => {
  // Get token from cookie or localStorage
  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  return getCookie('authToken') || localStorage.getItem('authToken');
};

const apiCall = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export function LiveClassView({ classId, className, onBack, lectureId }) {
  const [questions, setQuestions] = useState([]);
  const [showEndClassDialog, setShowEndClassDialog] = useState(false);
  const [isClassEnded, setIsClassEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingQuestions, setUpdatingQuestions] = useState(new Set());
  const [isEndingClass, setIsEndingClass] = useState(false);

  // Colors for question cards - matching the reference image
  const questionColors = [
    //{ bg: 'bg-blue-200', border: 'border-blue-300', text: 'text-black' },
    { bg: 'bg-pink-200', border: 'border-pink-300', text: 'text-black' },
    { bg: 'bg-yellow-200', border: 'border-yellow-300', text: 'text-black' },
    { bg: 'bg-green-200', border: 'border-green-300', text: 'text-black' },
    { bg: 'bg-purple-200', border: 'border-purple-300', text: 'text-black' },
    { bg: 'bg-orange-200', border: 'border-orange-300', text: 'text-black' },
    //{ bg: 'bg-indigo-200', border: 'border-indigo-300', text: 'text-black' },
    { bg: 'bg-teal-200', border: 'border-teal-300', text: 'text-black' }
  ];

  // Fetch questions from API
  const fetchQuestions = async () => {
    if (!lectureId) {
      console.error('No lectureId provided');
      setError('No lecture ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiCall(`/questions?lectureId=${lectureId}`);
      
      // Transform API response to match component structure
      const transformedQuestions = response.questions?.map((q, index) => ({
        id: q._id,
        text: q.question, // API uses 'question' field instead of 'text'
        studentName: q.studentId?.name || 'Anonymous Student', // API uses 'studentId' object
        timestamp: q.createdAt,
        isAnswered: q.status === 'answered', // API status values: 'answered' or 'unanswered'
        isStarred: q.isIMP || false,
        color: questionColors[index % questionColors.length],
        answer: q.status === 'answered' ? (q.answer || 'This question was answered during the live session.') : null,
        // Additional fields from API
        isValid: q.isValid,
        lectureInfo: q.lectureId ? {
          topic: q.lectureId.topic,
          subject: q.lectureId.subject
        } : null
      })) || [];

      setQuestions(transformedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch questions on component mount and set up polling
  useEffect(() => {
    fetchQuestions();

    // Set up polling to fetch new questions every 10 seconds during live class
    const pollInterval = setInterval(() => {
      if (!isClassEnded) {
        fetchQuestions();
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [lectureId, isClassEnded]);

  const handleEndClass = async () => {
    if (!lectureId) {
      console.error('No lectureId provided for ending class');
      alert('Error: Cannot end class - missing lecture ID');
      return;
    }

    try {
      setIsEndingClass(true);
      setShowEndClassDialog(false);
      
      // Update lecture status to "completed" via API
      console.log('Updating lecture status to completed...');
      await apiCall(`/lectures/${lectureId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'completed'
        })
      });
      
      console.log('Lecture status updated successfully');
      setIsClassEnded(true);
      
      // Prepare ended class data for lecture history
      const endedClassData = {
        className: className,
        duration: '~45m', // Could be calculated from actual start time
        participants: 24, // This would come from actual connected students
        totalQuestions: questions.length,
        answeredQuestions: questions.filter(q => q.isAnswered).length,
        topics: [], // Could be extracted from question content or manually added
        questions: questions,
        lectureId: lectureId,
        status: 'completed'
      };
      
      // Save lecture questions to permanent storage (API call would go here)
      console.log('Saving lecture questions:', questions);
      
      // Pass the ended class data back to the parent component
      setTimeout(() => {
        onBack(endedClassData);
      }, 1000);
      
    } catch (error) {
      console.error('Error ending class:', error);
      
      // Revert the UI state if API call fails
      setIsEndingClass(false);
      
      // Show error message to user
      alert('Failed to end class. Please try again.');
    }
  };

  const handleStarQuestion = async (questionId) => {
    if (updatingQuestions.has(questionId)) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    try {
      setUpdatingQuestions(prev => new Set([...prev, questionId]));

      // Update question importance via API
      await apiCall(`/questions/${questionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isIMP: !question.isStarred
        })
      });

      // Update local state
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId ? { ...q, isStarred: !q.isStarred } : q
        )
      );
    } catch (err) {
      console.error('Error updating question importance:', err);
      // Show error message to user
      alert('Failed to update question importance. Please try again.');
    } finally {
      setUpdatingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  const handleMarkAnswered = async (questionId) => {
    if (updatingQuestions.has(questionId)) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    try {
      setUpdatingQuestions(prev => new Set([...prev, questionId]));

      const newStatus = question.isAnswered ? 'unanswered' : 'answered'; // API uses 'unanswered' instead of 'pending'
      
      // Update question status via API
      await apiCall(`/questions/${questionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus
        })
      });

      // Update local state
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId 
            ? { 
                ...q, 
                isAnswered: !q.isAnswered,
                answer: !q.isAnswered ? 'This question was answered during the live session.' : null
              } 
            : q
        )
      );
    } catch (err) {
      console.error('Error updating question status:', err);
      // Show error message to user
      alert('Failed to update question status. Please try again.');
    } finally {
      setUpdatingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  // Loading state
  if (isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar activeItem="classes" onItemClick={() => {}} isLiveSession={true} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar activeItem="classes" onItemClick={() => {}} isLiveSession={true} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchQuestions} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeItem="classes" onItemClick={() => {}} isLiveSession={true} />
      
      <div className="flex-1">
        {/* Header */}
        <div className="border-b border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{className}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
                    LIVE
                  </Badge>
                  {error && (
                    <Badge variant="destructive" className="bg-red-100 text-red-700">
                      Connection Issue
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={fetchQuestions}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="min-w-fit"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </Button>
              <Button
                onClick={() => setShowEndClassDialog(true)}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold min-w-fit border border-red-500"
                disabled={isClassEnded || isEndingClass}
              >
                {isEndingClass ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ending...
                  </>
                ) : isClassEnded ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Class Ended
                  </>
                ) : (
                  <>
                    <StopCircle className="w-4 h-4 mr-2" />
                    End Class
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Student Questions</h2>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-300">
                    {questions.filter(q => !q.isAnswered).length} unanswered
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    {questions.filter(q => q.isAnswered).length} answered
                  </Badge>
                </div>
              </div>
            </div>

            {/* Unanswered Questions Section */}
            {questions.filter(q => !q.isAnswered).length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h3 className="text-xl font-semibold text-foreground">Unanswered Questions</h3>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                    {questions.filter(q => !q.isAnswered).length} pending
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {questions
                      .filter(q => !q.isAnswered)
                      .sort((a, b) => {
                        // First, sort by starred status (starred questions first)
                        if (a.isStarred && !b.isStarred) return -1;
                        if (!a.isStarred && b.isStarred) return 1;
                        // If both have same starred status, sort by timestamp (newest first)
                        return new Date(b.timestamp) - new Date(a.timestamp);
                      })
                      .map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: index % 2 === 0 ? 1 : -1 
                    }}
                    exit={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className={`${question.color.bg} ${question.color.border} p-5 rounded-lg shadow-lg border-2 relative transform transition-all duration-200 hover:scale-105 hover:shadow-xl hover:rotate-0 min-h-[200px] max-w-[280px]`}
                    style={{
                      color: '#000000 !important',
                      backgroundColor: question.color.bg.includes('pink') ? '#fce7f3' :
                                     question.color.bg.includes('yellow') ? '#fef3c7' :
                                     question.color.bg.includes('green') ? '#d1fae5' :
                                     question.color.bg.includes('purple') ? '#e9d5ff' :
                                     question.color.bg.includes('orange') ? '#fed7aa' :
                                     question.color.bg.includes('teal') ? '#ccfbf1' : 'inherit'
                    }}
                    whileHover={{ 
                      rotate: 0,
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                  >
                    {/* Star Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStarQuestion(question.id)}
                      disabled={updatingQuestions.has(question.id)}
                      className={`absolute top-3 right-3 p-1 h-8 w-8 rounded-full transition-all duration-200 ${
                        question.isStarred 
                          ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200 shadow-md border border-yellow-300' 
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 border border-transparent'
                      }`}
                    >
                      {updatingQuestions.has(question.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star 
                          className={`w-4 h-4 ${question.isStarred ? 'fill-current' : ''}`} 
                        />
                      )}
                    </Button>

                    {/* Question Content */}
                    <div className="pr-6">
                      {/* Student Info */}
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-white/70 font-semibold" style={{ color: '#000000' }}>
                            {question.studentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: '#000000' }}>
                            {question.studentName}
                          </p>
                          <p className="text-xs" style={{ color: '#000000', opacity: 0.7 }}>
                            {new Date(question.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Question Text - Main Content */}
                      <div className="mb-4 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium leading-relaxed break-words flex-1" style={{ color: '#000000' }}>
                            {question.text}
                          </p>
                          {question.isStarred && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs ml-2 flex-shrink-0">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Important
                            </Badge>
                          )}
                        </div>
                        {/* Show if question is invalid */}
                        {question.isValid === false && (
                          <div className="mt-2">
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                              Invalid Question
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Bottom */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {question.isAnswered && (
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Answered
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAnswered(question.id)}
                            disabled={updatingQuestions.has(question.id)}
                            className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            {updatingQuestions.has(question.id) ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3 mr-1" />
                            )}
                            Mark Answered
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Answered Questions Section */}
            {questions.filter(q => q.isAnswered).length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-foreground">Answered Questions</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    {questions.filter(q => q.isAnswered).length} completed
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {questions
                      .filter(q => q.isAnswered)
                      .sort((a, b) => {
                        // First, sort by starred status (starred questions first)
                        if (a.isStarred && !b.isStarred) return -1;
                        if (!a.isStarred && b.isStarred) return 1;
                        // If both have same starred status, sort by timestamp (newest first)
                        return new Date(b.timestamp) - new Date(a.timestamp);
                      })
                      .map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          rotate: index % 2 === 0 ? 1 : -1 
                        }}
                        exit={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        className={`${question.color.bg} ${question.color.border} p-5 rounded-lg shadow-lg border-2 relative transform transition-all duration-200 hover:scale-105 hover:shadow-xl hover:rotate-0 min-h-[200px] max-w-[280px] opacity-75`}
                        style={{
                          color: '#000000 !important',
                          backgroundColor: question.color.bg.includes('pink') ? '#fce7f3' :
                                         question.color.bg.includes('yellow') ? '#fef3c7' :
                                         question.color.bg.includes('green') ? '#d1fae5' :
                                         question.color.bg.includes('purple') ? '#e9d5ff' :
                                         question.color.bg.includes('orange') ? '#fed7aa' :
                                         question.color.bg.includes('teal') ? '#ccfbf1' : 'inherit',
                          opacity: 0.75
                        }}
                        whileHover={{ 
                          rotate: 0,
                          scale: 1.02,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                      >
                        {/* Star Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStarQuestion(question.id)}
                          disabled={updatingQuestions.has(question.id)}
                          className={`absolute top-3 right-3 p-1 h-8 w-8 rounded-full transition-all duration-200 ${
                            question.isStarred 
                              ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200 shadow-md border border-yellow-300' 
                              : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 border border-transparent'
                          }`}
                        >
                          {updatingQuestions.has(question.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Star 
                              className={`w-4 h-4 ${question.isStarred ? 'fill-current' : ''}`} 
                            />
                          )}
                        </Button>

                        {/* Question Content */}
                        <div className="pr-6">
                          {/* Student Info */}
                          <div className="flex items-center gap-2 mb-4">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-white/70 font-semibold" style={{ color: '#000000' }}>
                                {question.studentName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: '#000000' }}>
                                {question.studentName}
                              </p>
                              <p className="text-xs" style={{ color: '#000000', opacity: 0.7 }}>
                                {new Date(question.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Question Text - Main Content */}
                          <div className="mb-4 flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium leading-relaxed break-words flex-1" style={{ color: '#000000' }}>
                                {question.text}
                              </p>
                              {question.isStarred && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs ml-2 flex-shrink-0">
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  Important
                                </Badge>
                              )}
                            </div>
                            {/* Show if question is invalid */}
                            {question.isValid === false && (
                              <div className="mt-2">
                                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                                  Invalid Question
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons - Bottom */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {question.isAnswered && (
                                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Answered
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAnswered(question.id)}
                                disabled={updatingQuestions.has(question.id)}
                                className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                {updatingQuestions.has(question.id) ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3 mr-1" />
                                )}
                                Mark Pending
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Empty state */}
            {questions.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-lg mb-2">No questions yet</p>
                <p className="text-gray-400">Students can ask questions during the live session</p>
              </div>
            )}

            {/* Message when only answered questions exist */}
            {questions.length > 0 && questions.filter(q => !q.isAnswered).length === 0 && questions.filter(q => q.isAnswered).length > 0 && !isLoading && (
              <div className="text-center py-8 mb-8 bg-green-50 rounded-lg border border-green-200">
                <Check className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-green-700 font-medium">All questions have been answered!</p>
                <p className="text-green-600 text-sm">Great job managing the live session.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End Class Confirmation Dialog */}
      <Dialog open={showEndClassDialog} onOpenChange={setShowEndClassDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              End Class Confirmation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to end this class? This will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Disconnect all students from the live session</li>
              <li>Save all questions ({questions.length} total) to your archive</li>
              <li>Mark the class as completed</li>
            </ul>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEndClassDialog(false)}
                className="flex-1 border-border text-card-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEndClass}
                variant="outline"
                disabled={isEndingClass}
                className="flex-1 border-red-500 text-red-600 bg-transparent hover:!bg-red-600 hover:!text-white hover:!border-red-600 transition-all duration-200"
              >
                {isEndingClass ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ending Class...
                  </>
                ) : (
                  <>
                    <StopCircle className="w-4 h-4 mr-2" />
                    End Class
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Class Ended/Ending Notification */}
      {(isClassEnded || isEndingClass) && (
        <Dialog open={isClassEnded || isEndingClass} onOpenChange={() => {}}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground flex items-center gap-2">
                {isEndingClass ? (
                  <>
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    Ending Class...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    Class Successfully Ended
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {isEndingClass ? (
                <>
                  <p className="text-muted-foreground">
                    Please wait while we end the class and update all records...
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating lecture status to completed...
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    The class has been successfully ended. All students have been disconnected and your questions have been saved to the archive.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to dashboard...
                  </p>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}