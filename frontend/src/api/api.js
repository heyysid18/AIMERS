import axios from 'axios';

// Dynamic API URL - works both locally and on Render
const getApiUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  } else {
    return 'https://aimers-backend-clv3.onrender.com/api';
  }
};

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: getApiUrl(),
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
export const fetchVideoTopics = (grade, subject) => API.get(`/videos/${grade}/${subject}`);

/* ========== DPPs ========== */
export const fetchDPPs = () => API.get('/dpps');
export const fetchDPPsBySubject = (subject) => API.get(`/dpps/subject/${subject}`);
export const submitMyDPP = (formData) => API.post('/dpps/submit', formData);

/* ========== LECTURES ========== */
export const fetchLectures = () => API.get('/lectures');
export const fetchLectureById = (id) => API.get(`/lectures/${id}`);

/* ========== DASHBOARD & PROGRESS ========== */
export const fetchCompletionStatus = (grade, subject) => API.get(`/dashboard/completion-status/${grade}/${subject}`);
export const trackVideoProgress = (data) => API.post('/dashboard/track-video', data);
export const trackDPPProgress = (data) => API.post('/dashboard/track-dpp', data);
export const trackPaperProgress = (data) => API.post('/dashboard/track-paper', data);

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
