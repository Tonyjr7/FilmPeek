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
