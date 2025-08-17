import axios from 'axios';

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto attach token from localStorage to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ========== AUTHENTICATION ========== */
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const getProfile = () => API.get('/auth/profile');

// Phone OTP
export const sendPhoneOtp = (payload) => API.post('/auth/otp/send', payload);
export const verifyPhoneOtp = (payload) => API.post('/auth/otp/verify', payload);

// Password reset
export const forgotPassword = (payload) => API.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => API.post('/auth/reset-password', payload);

/* ========== COURSES ========== */
export const fetchCourses = () => API.get('/courses');
export const fetchCourseById = (id) => API.get(`/courses/${id}`);

/* ========== DPPs ========== */
export const fetchDPPs = () => API.get('/dpps');
export const fetchDPPsBySubject = (subject) => API.get(`/dpps/subject/${subject}`);
export const submitMyDPP = (formData) => API.post('/dpps/submit', formData);

/* ========== LECTURES ========== */
export const fetchLectures = () => API.get('/lectures');
export const fetchLectureById = (id) => API.get(`/lectures/${id}`);

/* ========== PREVIOUS YEAR PAPERS ========== */
export const fetchPapers = () => API.get('/papers');
export const fetchBoardPapers = () => API.get('/papers/board');
export const fetchInstitutePapers = () => API.get('/papers/aimers');

/* ========== FORUM / DOUBTS ========== */
export const getAllThreads = () => API.get('/forum');
export const getThreadById = (id) => API.get(`/forum/${id}`);
export const createThread = (data) => API.post('/forum', data);
export const replyToThread = (id, reply) => API.post(`/forum/${id}/reply`, { reply });

/* ========== LIVE CLASSES ========== */
export const fetchLiveClasses = () => API.get('/live');
export const bookLiveClass = (id) => API.post(`/live/book/${id}`);

/* ========== ADMIN PROTECTED ROUTES ========== */
export const createCourse = (data) => API.post('/admin/course', data);
export const uploadLecture = (data) => API.post('/admin/lecture', data);
export const uploadDPP = (data) => API.post('/admin/dpp', data);
export const uploadPaper = (data) => API.post('/admin/paper', data);

/* ========== LOGOUT & SESSION ========== */
export const logoutUser = () => {
  localStorage.removeItem('token');
};
