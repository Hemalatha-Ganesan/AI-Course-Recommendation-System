import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('✅ API Base URL:', API_URL);

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`➡️ ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Global response handler
API.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Auto logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 🔐 AUTH API
export const authAPI = {
  register: (username, email, password) => {
    return API.post('/auth/register', { username, email, password });
  },

  login: (email, password) => {
    return API.post('/auth/login', { email, password });
  },

  getMe: () => {
    return API.get('/auth/me');
  },
};

// 📚 COURSE API
export const courseAPI = {
  getCourses: () => API.get('/courses'),
  getCourseById: (id) => API.get(`/courses/${id}`),
  getAllCourses: () => API.get('/courses'),
  getTotalCoursesCount: () => API.get('/courses/count'),
  enrollCourse: (courseId) => API.post(`/courses/${courseId}/enroll`),
  getEnrolledCourses: () => API.get('/courses/user/enrolled'),
  getMyLearning: () => API.get('/courses/user/learning'),
  updateCourseProgress: (courseId, payload) => API.put(`/courses/${courseId}/progress`, payload),
  rateCourse: (courseId, rating, review) => API.post('/ratings', { courseId, rating, review }),
};

// 📚 COURSE CONTENT API (Learning Path)
export const contentAPI = {
  // Get course content with sections and lessons
  getCourseContent: (courseId) => API.get(`/courses/${courseId}/content`),
  
  // Get specific lesson content
  getLesson: (courseId, sectionIndex, lessonIndex) => 
    API.get(`/courses/${courseId}/content/lessons/${sectionIndex}/${lessonIndex}`),
  
  // Update lesson progress (watch time, completion)
  updateLessonProgress: (courseId, sectionIndex, lessonIndex, data) => 
    API.put(`/courses/${courseId}/content/lessons/${sectionIndex}/${lessonIndex}/progress`, data),
  
  // Update course content (admin/instructor)
  updateCourseContent: (courseId, sections) => 
    API.put(`/courses/${courseId}/content`, { sections }),
};

// 🎯 RECOMMENDATION API
export const recommendationAPI = {
  getPersonalizedRecommendations: () => API.get('/recommendations/personalized'),
  searchRecommendations: (query, limit = 10, category, difficulty) => 
    API.get('/recommendations/search', { 
      params: { query, limit, category, difficulty } 
    }),
  getCourseBasedRecommendations: (courseId, limit = 6) => 
    API.get(`/recommendations/course/${courseId}`, { params: { limit } }),
  getRecommendationsByFilters: (category, difficulty, courseId) => 
    API.post('/recommendations/filters', { category, difficulty, courseId }),
  getTrendingCourses: (limit = 10) => 
    API.get('/recommendations/trending', { params: { limit } }),
};

// 👑 ADMIN API
export const adminAPI = {
  // Dashboard Stats
  getStats: () => API.get('/admin/stats'),
  
  // User Management
  getAllUsers: () => API.get('/admin/users'),
  getUserById: (id) => API.get(`/admin/users/${id}`),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  
  // Course Management
  getAllCourses: () => API.get('/admin/courses'),
  createCourse: (courseData) => API.post('/admin/courses', courseData),
  updateCourse: (id, courseData) => API.put(`/admin/courses/${id}`, courseData),
  deleteCourse: (id) => API.delete(`/admin/courses/${id}`),
  
  // Analytics
  getAnalytics: () => API.get('/admin/analytics'),
  getRevenueData: () => API.get('/admin/analytics/revenue'),
  
  // Enrollments
  getAllEnrollments: () => API.get('/admin/enrollments'),
  
  // Recent History
  getRecentHistory: (limit = 20) => API.get(`/admin/history?limit=${limit}`),
  getLeaderboard: (limit = 10, metric = 'hours') => API.get('/admin/leaderboard', { params: { limit, metric } }),
};

export default API;

