// backend/models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  learnerId: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedMaterials: [{
    type: Number  // Array of material indices that are completed
  }],
  lastAccessedMaterial: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create compound index for efficient lookups
progressSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
