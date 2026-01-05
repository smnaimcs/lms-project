// src/components/InstructorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Upload, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import Navbar from './Navbar';
import MessageAlert from './MessageAlert';
import CourseCard from './CourseCard';
import MaterialUpload from './MaterialUpload';
import CourseEditor from './CourseEditor';
import { getInstructorCourses, uploadCourse, updateCourseMaterials } from '../services/api';

const InstructorDashboard = ({ currentUser, balance, onLogout, onBalanceUpdate }) => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    materials: []
  });

  useEffect(() => {
    fetchInstructorCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const fetchInstructorCourses = async () => {
    try {
      const response = await getInstructorCourses(currentUser.id);
      setCourses(response.courses);
    } catch (error) {
      showMessage(error.error || 'Failed to fetch courses', 'error');
    }
  };

  const handleUploadCourse = async () => {
    if (!newCourse.title || !newCourse.price) {
      showMessage('Please fill in title and price', 'error');
      return;
    }

    if (parseFloat(newCourse.price) <= 0) {
      showMessage('Price must be greater than 0', 'error');
      return;
    }

    if (newCourse.materials.length === 0) {
      showMessage('Please add at least one material', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await uploadCourse(
        currentUser.id,
        newCourse.title,
        newCourse.description,
        newCourse.price,
        newCourse.materials
      );

      showMessage(
        `Course uploaded successfully! You received $${response.payment} upload fee`,
        'success'
      );
      
      onBalanceUpdate(balance + response.payment);
      setNewCourse({ title: '', description: '', price: '', materials: [] });
      setShowUploadForm(false);
      fetchInstructorCourses();
    } catch (error) {
      showMessage(error.error || 'Failed to upload course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
  };

  const handleSaveCourse = async (editedCourse) => {
    try {
      await updateCourseMaterials(editedCourse.id, currentUser.id, editedCourse.materials);
      showMessage('Course updated successfully!', 'success');
      fetchInstructorCourses();
    } catch (error) {
      showMessage(error.error || 'Failed to update course', 'error');
      throw error;
    }
  };

  const totalRevenue = courses.length * 200; // Upload fees
  const averageCoursePrice = courses.length > 0
    ? (courses.reduce((sum, c) => sum + c.price, 0) / courses.length).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} balance={balance} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">{courses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Upload Revenue</p>
                <p className="text-3xl font-bold text-gray-800">${totalRevenue}</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Avg Course Price</p>
                <p className="text-3xl font-bold text-gray-800">${averageCoursePrice}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500 opacity-80" />
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

        {/* Upload Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition shadow-md flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {showUploadForm ? 'Cancel' : 'Upload New Course'}
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Upload New Course</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Advanced React Development"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe what students will learn..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  placeholder="99"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Material Upload Component */}
              <div className="mt-4">
                <MaterialUpload
                  materials={newCourse.materials}
                  onChange={(materials) => setNewCourse({ ...newCourse, materials })}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Upload Bonus:</strong> Receive $200 immediately upon course upload!
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Plus, earn 70% revenue share on every enrollment.
                </p>
              </div>

              <button
                onClick={handleUploadCourse}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                <Upload className="w-5 h-5" />
                {loading ? 'Uploading...' : 'Upload Course & Earn $200'}
              </button>
            </div>
          </div>
        )}

        {/* Courses List */}
        <h3 className="text-2xl font-bold mb-6 text-gray-800">My Courses</h3>
        
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No courses uploaded yet</p>
            <p className="text-gray-500 text-sm">Upload your first course to start earning!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                userType="instructor"
                onEdit={handleEditCourse}
              />
            ))}
          </div>
        )}
      </div>

      {/* Course Editor Modal */}
      {editingCourse && (
        <CourseEditor
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
};

export default InstructorDashboard;
