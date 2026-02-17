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
  enrollCourse: (courseId) => API.post('/enrollments', { courseId }),
  getEnrolledCourses: () => API.get('/enrollments/my-courses'),
  rateCourse: (courseId, rating, review) => API.post('/ratings', { courseId, rating, review }),
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
};

export default API;