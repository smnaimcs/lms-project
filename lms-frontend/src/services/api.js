// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication APIs
export const login = async (email, password, type) => {
  try {
    const response = await api.post('/auth/login', { email, password, type });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

export const register = async (email, password, name, type) => {
  try {
    const response = await api.post('/auth/register', { email, password, name, type });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

// Bank APIs
export const setupBank = async (userId, accountNumber, bankSecret) => {
  try {
    const response = await api.post('/bank/setup', { userId, accountNumber, bankSecret });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Bank setup failed' };
  }
};

export const getBalance = async (userId) => {
  try {
    const response = await api.get(`/bank/balance/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch balance' };
  }
};

export const createTransaction = async (fromUserId, toUserId, amount, description, bankSecret) => {
  try {
    const response = await api.post('/bank/transaction', {
      fromUserId,
      toUserId,
      amount,
      description,
      bankSecret,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Transaction failed' };
  }
};

// Course APIs
export const getCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch courses' };
  }
};

export const getCourse = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch course' };
  }
};

export const uploadCourse = async (instructorId, title, description, price, materials) => {
  try {
    const response = await api.post('/courses', {
      instructorId,
      title,
      description,
      price,
      materials,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to upload course' };
  }
};

export const getInstructorCourses = async (instructorId) => {
  try {
    const response = await api.get(`/courses/instructor/${instructorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch instructor courses' };
  }
};

export const updateCourseMaterials = async (courseId, instructorId, materials) => {
  try {
    const response = await api.put(`/courses/${courseId}/materials`, {
      instructorId,
      materials
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update course materials' };
  }
};

// Enrollment APIs
export const enrollCourse = async (learnerId, courseId, bankSecret) => {
  try {
    const response = await api.post('/enrollments', {
      learnerId,
      courseId,
      bankSecret,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Enrollment failed' };
  }
};

export const getLearnerEnrollments = async (learnerId) => {
  try {
    const response = await api.get(`/enrollments/learner/${learnerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch enrollments' };
  }
};

// Certificate APIs
export const completeCourse = async (learnerId, courseId) => {
  try {
    const response = await api.post('/certificates', { learnerId, courseId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to complete course' };
  }
};

export const getLearnerCertificates = async (learnerId) => {
  try {
    const response = await api.get(`/certificates/learner/${learnerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch certificates' };
  }
};

// Progress APIs
export const getProgress = async (learnerId, courseId) => {
  try {
    const response = await api.get(`/progress/${learnerId}/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch progress' };
  }
};

export const updateProgress = async (learnerId, courseId, completedMaterials, lastAccessedMaterial) => {
  try {
    const response = await api.post('/progress', {
      learnerId,
      courseId,
      completedMaterials,
      lastAccessedMaterial
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update progress' };
  }
};

// Admin APIs
export const getTransactions = async () => {
  try {
    const response = await api.get('/admin/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch transactions' };
  }
};

export const getPlatformStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch stats' };
  }
};

export default api;
