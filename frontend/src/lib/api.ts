const SERVER = (import.meta.env.VITE_SERVER_URL as string) || 'http://localhost:5000';

const TOKEN_KEY = 'token';

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${SERVER}${path}`;
  const headers = new Headers(options.headers as HeadersInit || {});

  // default to JSON when body present and no content-type set
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });

  // If unauthorized, clear stored token (simple session handling)
  if (res.status === 401) {
    clearToken();
    // forward a standardized error
    const errBody = await safeJson(res);
    throw { status: 401, data: errBody };
  }

  const data = await safeJson(res);
  if (!res.ok) throw { status: res.status, data };
  return data;
}

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (username: string, email: string, password: string) =>
    request('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  // placeholder for future endpoints
  getProfile: () => request('/api/users/profile'),
};

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  coursesId: string[];  // Array of course IDs associated with this category
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  rating: number;
  topics: string[];
  progress: number;
  categoryId: string;
}

/**
 * Per-user progress record for a single course.
 * - userId and courseId are stringified ObjectId values coming from the backend.
 * - progress is a percentage 0-100.
 * - attempts count number of times user started/restarted the course.
 * - score is optional (for quiz/assessment scores).
 * - timeSpentSeconds tracks time spent in seconds.
 * - timestamps are ISO strings when coming from the API.
 */
export interface CourseProgress {
  id?: string; // optional progress document id
  userId: string;
  courseId: string;
  progress: number; // 0-100
  attempts?: number;
  score?: number | null;
  timeSpentSeconds?: number;
  startedAt?: string | null;
  lastAccessedAt?: string | null;
  completedAt?: string | null;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Aggregated performance metrics for a course across users.
 * Useful for dashboards (average progress, completion rate, average score, totals).
 */
export interface CoursePerformance {
  courseId: string;
  totalParticipants: number; // number of users who have any record for this course
  averageProgress: number; // 0-100
  completionRate: number; // 0-1 fraction of users with progress === 100
  averageScore?: number | null; // if score is applicable
  medianProgress?: number;
  // optional: distribution buckets of progress (e.g. 0-25,25-50...)
  progressDistribution?: Array<{ range: string; count: number }>;
}

/**
 * Quick mapping type for user's progress keyed by courseId.
 * Example: { "650a...": 45 }
 */
export type UserProgressMap = Record<string, number>;

export const coursesApi = {
  // Get all course categories
  getCategories: () => 
    request('/api/courses/categories'),

  // Get all courses
  getAllCourses: () => 
    request('/api/courses'),

  // Get courses by category
  getCoursesByCategory: (categoryId: string) => 
    request(`/api/courses/category/${categoryId}`),

  // Get user's course progress
  getUserProgress: () => 
    request('/api/courses/progress'),

  // Start or continue a course
  startCourse: (courseId: string) => 
    request(`/api/courses/${courseId}/start`, { method: 'POST' }),

  // Update course progress
  updateProgress: (courseId: string, progress: number) => 
    request(`/api/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress })
    }),
};

export default request;
