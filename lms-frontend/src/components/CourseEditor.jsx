// src/components/CourseEditor.jsx
import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
import MaterialUpload from './MaterialUpload';
import MessageAlert from './MessageAlert';

const CourseEditor = ({ course, onClose, onSave }) => {
  const [editedCourse, setEditedCourse] = useState({
    ...course,
    materials: course.materials || []
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSave = async () => {
    if (editedCourse.materials.length === 0) {
      showMessage('Please add at least one material', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSave(editedCourse);
      showMessage('Course updated successfully!', 'success');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      showMessage('Failed to update course', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Edit Course</h2>
              <p className="text-sm text-green-100">{course.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {message.text && (
            <MessageAlert
              message={message.text}
              type={message.type}
              onClose={() => setMessage({ text: '', type: '' })}
            />
          )}

          <div className="space-y-6">
            {/* Course Info (Read-only) */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Course Title
                  </label>
                  <p className="text-gray-800 font-medium">{course.title}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Price
                  </label>
                  <p className="text-gray-800 font-medium">${course.price}</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <p className="text-gray-700 text-sm">{course.description}</p>
              </div>
            </div>

            {/* Materials Editor */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Course Materials
              </h3>
              <MaterialUpload
                materials={editedCourse.materials}
                onChange={(materials) => setEditedCourse({ ...editedCourse, materials })}
              />
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can add new materials or remove existing ones. 
                Changes will be visible to all enrolled students immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
