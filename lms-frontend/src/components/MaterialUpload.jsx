// src/components/MaterialUpload.jsx
import React, { useState } from 'react';
import { Upload, Plus, Trash2, FileText, PlayCircle, HelpCircle, Music } from 'lucide-react';

const MaterialUpload = ({ materials, onChange }) => {
  const [newMaterial, setNewMaterial] = useState({
    type: 'video',
    title: '',
    content: '',
    url: ''
  });

  const handleAddMaterial = () => {
    if (!newMaterial.title) {
      alert('Please enter a title for the material');
      return;
    }

    onChange([...materials, { ...newMaterial }]);
    setNewMaterial({ type: 'video', title: '', content: '', url: '' });
  };

  const handleRemoveMaterial = (index) => {
    const updated = materials.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-5 h-5 text-red-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-600" />;
      case 'text':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'mcq':
        return <HelpCircle className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Course Materials
        </label>
        <span className="text-xs text-gray-500">
          {materials.length} material{materials.length !== 1 ? 's' : ''} added
        </span>
      </div>

      {/* Existing Materials List */}
      {materials.length > 0 && (
        <div className="space-y-2 mb-4">
          {materials.map((material, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex-shrink-0">
                {getMaterialIcon(material.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {material.title}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {material.type}
                  {material.url && ` - ${material.url}`}
                </p>
              </div>
              <button
                onClick={() => handleRemoveMaterial(index)}
                className="flex-shrink-0 text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Material Form */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Material</span>
        </div>

        {/* Material Type Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Material Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'video', label: 'Video', icon: PlayCircle, color: 'red' },
              { value: 'audio', label: 'Audio', icon: Music, color: 'purple' },
              { value: 'text', label: 'Text', icon: FileText, color: 'blue' },
              { value: 'mcq', label: 'Quiz', icon: HelpCircle, color: 'green' }
            ].map((type) => {
              const Icon = type.icon;
              const isSelected = newMaterial.type === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setNewMaterial({ ...newMaterial, type: type.value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                    isSelected
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${
                    isSelected ? `text-${type.color}-600` : 'text-gray-400'
                  }`} />
                  <span className={`text-xs font-medium ${
                    isSelected ? `text-${type.color}-700` : 'text-gray-600'
                  }`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Material Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Introduction to React Hooks"
            value={newMaterial.title}
            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Conditional Fields based on type */}
        {(newMaterial.type === 'video' || newMaterial.type === 'audio') && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              URL / File Path
            </label>
            <input
              type="text"
              placeholder={`https://example.com/${newMaterial.type}.mp4`}
              value={newMaterial.url}
              onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL or file path for the {newMaterial.type}
            </p>
          </div>
        )}

        {(newMaterial.type === 'text' || newMaterial.type === 'mcq') && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              placeholder={
                newMaterial.type === 'text'
                  ? 'Enter the lesson content here...'
                  : 'Enter quiz questions and answers...'
              }
              value={newMaterial.content}
              onChange={(e) => setNewMaterial({ ...newMaterial, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm h-24"
            />
          </div>
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddMaterial}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Add multiple materials to create a comprehensive course. 
          Include videos for visual learning, text for reading, and quizzes for assessment.
        </p>
      </div>
    </div>
  );
};

export default MaterialUpload;
