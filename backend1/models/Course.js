// ==================== backend/models/Course.js ====================
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  instructor: {
    type: String,
    required: true
  },
  instructorId: {
    type: String,
    required: true
  },
  materials: [{
    type: {
      type: String,
      enum: ['video', 'text', 'audio', 'mcq']
    },
    title: String,
    content: String,
    url: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
