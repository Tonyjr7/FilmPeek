// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export const getTrendingMovies = () => api.get('/movie/trending');
export const getMovieDetails = (id) => api.get(`/movie/${id}`);
export const getWatchlists = () => api.get('movie/user/watchlists');
export const createWatchlist = (watchlistName, token) =>
  api.post(
    'movie/user/watchlist/create-watchlist',
    { watchlistName }, // body
    { headers: { Authorization: `Bearer ${token}` } },
  );
export const addToWatchList = (movieId, watchlistId, token) =>
  api.patch(
    'movie/user/watchlist/add-movie',
    { movieId, watchlistId }, // body
    { headers: { Authorization: `Bearer ${token}` } },
  );

export const fetchWatchList = (id, token) =>
  api.get(`movie/user/watchlist/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchWatchLists = (token) =>
  api.get(`movie/user/watchlists`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const removeWatchList = (id, token) =>
  api.delete(`movie/user/watchlist/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchFavorites = (token) =>
  api.get('movie/user/favorites', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const removeFromFavorite = (movieId, token) =>
  api.post(
    'movie/user/favorites/remove',
    { movieId }, // body
    { headers: { Authorization: `Bearer ${token}` } },
  );

export const addToFavorite = (movieId, token) =>
  api.post(
    'movie/user/favorites/add',
    { movieId }, // body
    { headers: { Authorization: `Bearer ${token}` } },
  );

export const getSimilarMovies = (id) => api.get(`/movie/${id}/similar`);

export const signUp = (name, email, password) =>
  api.post('auth/signup', { name, email, password });

export const signIn = (email, password) =>
  api.post('auth/signin', { email, password });

export const userProfile = (token) =>
  api.get('auth/user/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const movieTrailer = (movieId) => api.get(`movie/trailer/${movieId}`);

// TV Series endpoints
export const getTrendingSeries = () => api.get('/series/trending');
export const getPopularSeries = () => api.get('/series/popular-series');
export const getTopRatedSeries = () => api.get('/series/top-rated');
export const getSeriesDetails = (id) => api.get(`/series/${id}`);
export const getSimilarSeries = (id) => api.get(`/series/${id}/similar`);
export const seriesTrailer = (seriesId) => api.get(`series/trailer/${seriesId}`);
export const searchSeries = (name) => api.get(`series/search?name=${encodeURIComponent(name)}`);
export const getSeriesSeasonDetails = (id, seasonNumber) =>
  api.get(`/series/${id}/season/${seasonNumber}`);

// AI feature endpoints
export const postAIMatch = (query) => api.post('/ai/match', { query });
export const postAIExplain = (movieTitle, genres, overview) =>
  api.post('/ai/explain', { movieTitle, genres, overview });



