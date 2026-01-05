// src/components/LearnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Award, BookOpen, TrendingUp } from 'lucide-react';
import Navbar from './Navbar';
import MessageAlert from './MessageAlert';
import CourseCard from './CourseCard';
import CourseViewer from './CourseViewer';
import { getCourses, enrollCourse, completeCourse, getLearnerEnrollments } from '../services/api';

const LearnerDashboard = ({ currentUser, bankSecret, balance, onLogout, onBalanceUpdate }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'enrolled'
  const [selectedCourse, setSelectedCourse] = useState(null);

  console.log('Bank Secret in Dashboard:', bankSecret); // Debug log

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses();
      await fetchEnrollments();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.courses);
    } catch (error) {
      showMessage(error.error || 'Failed to fetch courses', 'error');
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await getLearnerEnrollments(currentUser.id);
      setEnrolledCourses(response.enrollments.map(e => e.courseId));
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    }
  };

  const handleEnrollCourse = async (course) => {
    if (balance < course.price) {
      showMessage('Insufficient balance!', 'error');
      return;
    }

    if (!bankSecret) {
      showMessage('Bank secret not found. Please logout and login again.', 'error');
      return;
    }

    setLoading(true);
    setLoadingCourseId(course.id);
    showMessage('Processing payment...', 'info');

    console.log('Enrolling with:', { 
      learnerId: currentUser.id, 
      courseId: course.id, 
      bankSecret: bankSecret ? '***' : 'MISSING'
    }); // Debug log

    try {
      const response = await enrollCourse(currentUser.id, course.id, bankSecret);
      setEnrolledCourses(prev => [...prev, course.id]);
      onBalanceUpdate(response.newBalance);
      showMessage(
        `Successfully enrolled in ${course.title}! Transaction ID: ${response.transaction.id}`,
        'success'
      );
      fetchEnrollments();
    } catch (error) {
      console.error('Enrollment error:', error);
      showMessage(error.error || 'Enrollment failed', 'error');
    } finally {
      setLoading(false);
      setLoadingCourseId(null);
    }
  };

  const handleCompleteCourse = async (courseId) => {
    setLoading(true);
    setLoadingCourseId(courseId);

    try {
      const response = await completeCourse(currentUser.id, courseId);
      showMessage(
        `Congratulations! Certificate awarded! Certificate ID: ${response.certificate.id}`,
        'success'
      );
      setSelectedCourse(null);
    } catch (error) {
      showMessage(error.error || 'Failed to complete course', 'error');
    } finally {
      setLoading(false);
      setLoadingCourseId(null);
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
  };

  const filteredCourses = activeTab === 'enrolled' 
    ? courses.filter(c => enrolledCourses.includes(c.id))
    : courses;

  const enrollmentCount = enrolledCourses.length;
  const totalSpent = courses
    .filter(c => enrolledCourses.includes(c.id))
    .reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} balance={balance} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-800">{enrollmentCount}</p>
              </div>
              <BookOpen className="w-12 h-12 text-indigo-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-800">${totalSpent}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Certificates</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <Award className="w-12 h-12 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>

        {message.text && (
          <MessageAlert 
            message={message.text} 
            type={message.type} 
            onClose={() => setMessage({ text: '', type: '' })}
          />
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'enrolled'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            My Courses ({enrollmentCount})
          </button>
        </div>

        {/* Course Grid */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          {activeTab === 'all' ? 'Available Courses' : 'My Enrolled Courses'}
        </h2>
        
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {activeTab === 'enrolled' 
                ? 'You have not enrolled in any courses yet.'
                : 'No courses available.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourses.includes(course.id)}
                onEnroll={handleEnrollCourse}
                onComplete={() => handleViewCourse(course)}
                loading={loading && loadingCourseId === course.id}
                userType="learner"
              />
            ))}
          </div>
        )}
      </div>

      {/* Course Viewer Modal */}
      {selectedCourse && (
        <CourseViewer
          course={selectedCourse}
          learnerId={currentUser.id}
          onClose={() => setSelectedCourse(null)}
          onComplete={handleCompleteCourse}
        />
      )}
    </div>
  );
};

export default LearnerDashboard;
