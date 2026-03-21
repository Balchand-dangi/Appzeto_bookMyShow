import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

// Simple cache for API responses
const apiCache = {
    movies: { data: null, timestamp: 0 },
    movieDetail: {},
    shows: {},
    bookings: {},
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const SHOW_CACHE_DURATION = 30 * 1000; // 30 seconds for shows (more volatile)

const isCacheValid = (timestamp, duration = CACHE_DURATION) => {
    return Date.now() - timestamp < duration;
};

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('bms_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Global 401 interceptor — clear stale tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('bms_token');
            localStorage.removeItem('bms_user');
        }
        return Promise.reject(error);
    }
);

// Admin APIs
export const adminAPI = {
    createMovie: (data) => api.post('/admin/movies', data),
    getMovies: () => api.get('/admin/movies'),
    createShow: (data) => api.post('/admin/shows', data),
    getShows: (movieId) => api.get('/admin/shows', { params: movieId ? { movieId } : {} }),
};

// User APIs with caching
export const moviesAPI = {
    getAll: async (page, limit) => {
        // Only cache the main listing (no pagination params)
        if (!page && !limit) {
            if (apiCache.movies.data && isCacheValid(apiCache.movies.timestamp)) {
                return apiCache.movies.data;
            }
        }
        const response = await api.get('/movies', { params: { page, limit } });
        if (!page && !limit) {
            apiCache.movies = { data: response, timestamp: Date.now() };
        }
        return response;
    },
    getById: async (id) => {
        // Cache individual movie details
        if (apiCache.movieDetail[id] && isCacheValid(apiCache.movieDetail[id].timestamp)) {
            return apiCache.movieDetail[id].data;
        }
        const response = await api.get(`/movies/${id}`);
        apiCache.movieDetail[id] = { data: response, timestamp: Date.now() };
        return response;
    },
};

export const showsAPI = {
    getByMovieId: async (movieId) => {
        // Cache shows with shorter expiry since they change more often
        if (apiCache.shows[movieId] && isCacheValid(apiCache.shows[movieId].timestamp, SHOW_CACHE_DURATION)) {
            return apiCache.shows[movieId].data;
        }
        const response = await api.get(`/shows/${movieId}`);
        apiCache.shows[movieId] = { data: response, timestamp: Date.now() };
        return response;
    },
};

export const seatsAPI = {
    lock: (data) => api.post('/seats/lock', data),
};

export const bookingAPI = {
    create: async (data) => {
        const response = await api.post('/book', data);
        // Clear bookings cache when new booking is created
        apiCache.bookings = {};
        // Clear show seat cache since booking affects seat availability
        apiCache.shows = {};
        return response;
    },
    getByUserId: async (userId) => {
        // Cache bookings with shorter expiry since they can change
        const cacheKey = `bookings_${userId}`;
        if (apiCache.bookings[cacheKey] && isCacheValid(apiCache.bookings[cacheKey].timestamp, SHOW_CACHE_DURATION)) {
            return apiCache.bookings[cacheKey].data;
        }
        const response = await api.get(`/bookings/${userId}`);
        apiCache.bookings[cacheKey] = { data: response, timestamp: Date.now() };
        return response;
    },
};

// Cache management utilities
export const cacheAPI = {
    clearMovieCache: () => {
        apiCache.movies = { data: null, timestamp: 0 };
    },
    clearShowCache: (movieId) => {
        if (movieId) {
            delete apiCache.shows[movieId];
        } else {
            apiCache.shows = {};
        }
    },
    clearBookingCache: (userId) => {
        if (userId) {
            delete apiCache.bookings[`bookings_${userId}`];
        } else {
            apiCache.bookings = {};
        }
    },
    clearAllCache: () => {
        apiCache.movies = { data: null, timestamp: 0 };
        apiCache.movieDetail = {};
        apiCache.shows = {};
        apiCache.bookings = {};
    },
};

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

export default api;

