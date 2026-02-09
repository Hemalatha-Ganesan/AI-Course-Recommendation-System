import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Course APIs
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  searchCourses: (query) => api.get(`/courses/search?q=${query}`),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getEnrolledCourses: () => api.get('/courses/enrolled'),
};

// Recommendation APIs
export const recommendationAPI = {
  getRecommendations: (userId) => api.get(`/recommendations/${userId}`),
  getPersonalizedRecommendations: () => api.get('/recommendations/personalized'),
};

// User APIs
export const userAPI = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  getUserActivity: () => api.get('/users/activity'),
  trackActivity: (activityData) => api.post('/users/activity', activityData),
};

// Rating APIs
export const ratingAPI = {
  rateCourse: (courseId, rating) => api.post(`/ratings/${courseId}`, { rating }),
  getCourseRatings: (courseId) => api.get(`/ratings/${courseId}`),
};

export default api;