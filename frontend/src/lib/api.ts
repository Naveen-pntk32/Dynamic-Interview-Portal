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
}

export interface Course {
  id: string;
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
