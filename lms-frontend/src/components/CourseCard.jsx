// src/components/CourseCard.jsx
import React from 'react';
import { Award, BookOpen, DollarSign, User, Edit } from 'lucide-react';

const CourseCard = ({ 
  course, 
  isEnrolled, 
  onEnroll, 
  onComplete, 
  onEdit,
  loading,
  userType = 'learner' 
}) => {
  const getGradientColor = (index) => {
    const gradients = [
      'from-indigo-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-blue-500 to-cyan-600',
      'from-pink-500 to-rose-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`bg-gradient-to-r ${getGradientColor(course.id)} h-32 flex items-center justify-center`}>
        <BookOpen className="w-16 h-16 text-white opacity-80" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{course.title}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <User className="w-4 h-4" />
          <span className="text-sm">by {course.instructor}</span>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">{course.description}</p>
        
        {course.materials && course.materials.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Course Materials:</p>
            <div className="space-y-1">
              {course.materials.slice(0, 3).map((material, idx) => (
                <div key={idx} className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  {typeof material === 'string' 
                    ? material 
                    : `${material.type}: ${material.title}`}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-600">${course.price}</span>
          </div>
        </div>

        {userType === 'learner' && (
          isEnrolled ? (
            <div className="space-y-2">
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center font-medium">
                ✓ Enrolled
              </div>
              <button
                onClick={() => onComplete(course.id)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BookOpen className="w-5 h-5" />
                {loading ? 'Loading...' : 'Start Learning'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => onEnroll(course)}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Enroll Now'}
            </button>
          )
        )}

        {userType === 'instructor' && (
          <div className="space-y-2">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center text-sm font-medium">
              Your Course
            </div>
            <button
              onClick={() => onEdit(course)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Materials
            </button>
            <div className="text-xs text-gray-600 text-center">
              {course.materials?.length || 0} material(s)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
