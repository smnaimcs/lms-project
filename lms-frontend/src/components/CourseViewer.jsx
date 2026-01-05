// src/components/CourseViewer.jsx
import React, { useState, useEffect } from 'react';
import { X, PlayCircle, FileText, HelpCircle, CheckCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import MessageAlert from './MessageAlert';
import { getProgress, updateProgress } from '../services/api';

const CourseViewer = ({ course, learnerId, onClose, onComplete }) => {
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);
  const [completedMaterials, setCompletedMaterials] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProgress = async () => {
    try {
      const response = await getProgress(learnerId, course.id);
      if (response.progress) {
        setCompletedMaterials(response.progress.completedMaterials || []);
        setCurrentMaterialIndex(response.progress.lastAccessedMaterial || 0);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (completed, materialIndex) => {
    try {
      await updateProgress(learnerId, course.id, completed, materialIndex);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const materials = course.materials || [];
  const currentMaterial = materials[currentMaterialIndex];

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleMarkComplete = async () => {
    if (!completedMaterials.includes(currentMaterialIndex)) {
      const updated = [...completedMaterials, currentMaterialIndex];
      setCompletedMaterials(updated);
      await saveProgress(updated, currentMaterialIndex);
      showMessage('Lesson marked as complete!', 'success');
    }
  };

  const handleNext = async () => {
    if (currentMaterialIndex < materials.length - 1) {
      const newIndex = currentMaterialIndex + 1;
      setCurrentMaterialIndex(newIndex);
      await saveProgress(completedMaterials, newIndex);
    }
  };

  const handlePrevious = async () => {
    if (currentMaterialIndex > 0) {
      const newIndex = currentMaterialIndex - 1;
      setCurrentMaterialIndex(newIndex);
      await saveProgress(completedMaterials, newIndex);
    }
  };

  const handleCompleteCourse = () => {
    const allCompleted = completedMaterials.length === materials.length;
    if (!allCompleted) {
      showMessage('Please complete all lessons first!', 'error');
      return;
    }
    setShowCompletionModal(true);
  };

  const confirmCompletion = () => {
    onComplete(course.id);
    setShowCompletionModal(false);
    onClose();
  };

  const progress = (completedMaterials.length / materials.length) * 100;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      case 'mcq':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderMaterialContent = () => {
    if (!currentMaterial) return null;

    switch (currentMaterial.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <PlayCircle className="w-24 h-24 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">{currentMaterial.title}</p>
                <p className="text-sm text-gray-400">Video URL: {currentMaterial.url || currentMaterial.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  In production, this would be a video player
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Video playback would be integrated here using a video player library like React Player or HTML5 video element.
              </p>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{currentMaterial.title}</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentMaterial.content || 'Text content would be displayed here...'}
              </div>
            </div>
          </div>
        );

      case 'mcq':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{currentMaterial.title}</h3>
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="font-semibold text-purple-900 mb-3">Sample Question:</p>
                  <p className="text-gray-800 mb-4">What is the time complexity of binary search?</p>
                  <div className="space-y-2">
                    {['O(n)', 'O(log n)', 'O(n²)', 'O(1)'].map((option, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Full quiz functionality would include multiple questions, scoring, and immediate feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">Material type not supported</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{course.title}</h2>
            <p className="text-sm text-indigo-100">by {course.instructor}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedMaterials.length} / {materials.length} lessons
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {message.text && (
          <div className="px-6 pt-4">
            <MessageAlert
              message={message.text}
              type={message.type}
              onClose={() => setMessage({ text: '', type: '' })}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="grid md:grid-cols-4 gap-6 p-6">
            {/* Sidebar - Materials List */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-gray-800 mb-3">Course Materials</h3>
              <div className="space-y-2">
                {materials.map((material, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMaterialIndex(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition flex items-center gap-3 ${
                      currentMaterialIndex === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <div className={`${
                      completedMaterials.includes(index) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {completedMaterials.includes(index) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        getMaterialIcon(material.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        currentMaterialIndex === index ? 'text-indigo-700' : 'text-gray-700'
                      }`}>
                        {material.title}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{material.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {renderMaterialContent()}

              {/* Material Actions */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentMaterialIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={completedMaterials.includes(currentMaterialIndex)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {completedMaterials.includes(currentMaterialIndex) ? 'Completed' : 'Mark Complete'}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentMaterialIndex === materials.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Complete Course */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <button
            onClick={handleCompleteCourse}
            disabled={completedMaterials.length !== materials.length}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-semibold"
          >
            <Award className="w-5 h-5" />
            Complete Course & Get Certificate
          </button>
          {completedMaterials.length !== materials.length && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Complete all {materials.length} lessons to finish the course
            </p>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h3>
            <p className="text-gray-600 mb-6">
              You've completed all lessons in <strong>{course.title}</strong>. 
              Are you ready to receive your certificate?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Not Yet
              </button>
              <button
                onClick={confirmCompletion}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition"
              >
                Get Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseViewer;
